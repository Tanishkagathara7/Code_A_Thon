import assert from 'node:assert';
import { test, describe } from 'node:test';
import path from 'path';
import fs from 'fs';
import {
  validateMagicBytes,
  validateUploadedFile,
  generateSafeStorageKey,
  sanitizeOriginalFilename,
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
} from '../utils/fileValidation';
import { LocalDevStorageProvider, StorageService } from '../services/storage';

// Valid header buffers
const MOCK_JPEG_HEADER = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
const MOCK_PNG_HEADER = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00]);
const MOCK_WEBP_HEADER = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
const MOCK_PDF_HEADER = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35]);
const MOCK_EXE_HEADER = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);

describe('1. File Validation & Magic Bytes Security Tests', () => {
  test('validateMagicBytes identifies valid image and PDF headers', () => {
    assert.strictEqual(validateMagicBytes(MOCK_JPEG_HEADER, 'image/jpeg'), true, 'Valid JPEG header should pass');
    assert.strictEqual(validateMagicBytes(MOCK_PNG_HEADER, 'image/png'), true, 'Valid PNG header should pass');
    assert.strictEqual(validateMagicBytes(MOCK_WEBP_HEADER, 'image/webp'), true, 'Valid WEBP header should pass');
    assert.strictEqual(validateMagicBytes(MOCK_PDF_HEADER, 'application/pdf'), true, 'Valid PDF header should pass');
  });

  test('validateMagicBytes rejects MIME spoofing attempts', () => {
    assert.strictEqual(validateMagicBytes(MOCK_EXE_HEADER, 'image/jpeg'), false, 'EXE header spoofed as JPEG should fail');
    assert.strictEqual(validateMagicBytes(MOCK_JPEG_HEADER, 'application/pdf'), false, 'JPEG header spoofed as PDF should fail');
    assert.strictEqual(validateMagicBytes(Buffer.from('hello world'), 'image/png'), false, 'Text header spoofed as PNG should fail');
  });

  test('validateUploadedFile validates supported file types & sizes', () => {
    const validImage = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      size: 1024 * 500, // 500 KB
      buffer: MOCK_JPEG_HEADER,
    };
    const resImg = validateUploadedFile(validImage);
    assert.strictEqual(resImg.valid, true, 'Valid image under 10MB should pass validation');
    assert.strictEqual(resImg.sanitizedExt, 'jpg');

    const validPdf = {
      originalname: 'report.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 1024 * 5, // 5 MB
      buffer: MOCK_PDF_HEADER,
    };
    const resPdf = validateUploadedFile(validPdf);
    assert.strictEqual(resPdf.valid, true, 'Valid PDF under 20MB should pass validation');
    assert.strictEqual(resPdf.sanitizedExt, 'pdf');
  });

  test('validateUploadedFile rejects dangerous extensions and oversized files', () => {
    const exeFile = {
      originalname: 'malware.exe',
      mimetype: 'image/jpeg',
      size: 1000,
      buffer: MOCK_JPEG_HEADER,
    };
    const resExe = validateUploadedFile(exeFile);
    assert.strictEqual(resExe.valid, false, 'Executable file extension should be blocked');
    assert.ok(resExe.error?.includes('blocked'), 'Error should state file extension is blocked');

    const oversizedImage = {
      originalname: 'huge.png',
      mimetype: 'image/png',
      size: MAX_IMAGE_SIZE + 100,
      buffer: MOCK_PNG_HEADER,
    };
    const resHuge = validateUploadedFile(oversizedImage);
    assert.strictEqual(resHuge.valid, false, 'Oversized image should be rejected');
    assert.ok(resHuge.error?.includes('exceeds'), 'Error should state size limit exceeded');
  });

  test('generateSafeStorageKey eliminates path traversal and produces safe keys', () => {
    const unsafeUserId = '../user/../hacker';
    const key = generateSafeStorageKey(unsafeUserId, 'png');
    assert.strictEqual(key.includes('..'), false, 'Storage key must not contain path traversal ..');
    assert.ok(key.endsWith('.png'), 'Storage key should end with safe extension');
    assert.ok(key.includes('/'), 'Storage key should contain safe folder delimiter');
  });

  test('sanitizeOriginalFilename cleans unsafe characters', () => {
    const raw = '../../My Unsafe ($Report#1)!.pdf';
    const clean = sanitizeOriginalFilename(raw);
    assert.strictEqual(clean.includes('..'), false, 'Path traversal prefix must be stripped');
    assert.ok(clean.includes('My Unsafe'), 'Original letters should be preserved safely');
    assert.strictEqual(clean.includes('$'), false, 'Special characters like $ should be replaced');
  });
});

describe('2. Storage Abstraction Provider Tests', () => {
  const testDir = path.resolve(__dirname, 'test_uploads_tmp');
  const provider = new LocalDevStorageProvider(testDir);
  const service = new StorageService(provider);

  test('StorageService uploads, checks existence, gets url, and deletes file', async () => {
    const key = 'testuser123/sample_file.png';
    const input = {
      buffer: MOCK_PNG_HEADER,
      originalname: 'sample_file.png',
      mimetype: 'image/png',
      size: MOCK_PNG_HEADER.length,
    };

    const uploadRes = await service.upload(input, key);
    assert.strictEqual(uploadRes.provider, 'local_dev');
    assert.strictEqual(uploadRes.storageKey, key);
    assert.strictEqual(await service.exists(key), true, 'File should exist after upload');

    const url = await service.getUrl(key);
    assert.ok(url.includes(encodeURIComponent(key)), 'URL should incorporate encoded key');

    const deleted = await service.delete(key);
    assert.strictEqual(deleted, true, 'File deletion should return true');
    assert.strictEqual(await service.exists(key), false, 'File should no longer exist');
  });

  test('StorageProvider blocks path traversal attempts', async () => {
    const invalidKey = '../../etc/passwd';
    await assert.rejects(async () => {
      await provider.uploadFile(
        { buffer: Buffer.from('test'), originalname: 'test', mimetype: 'text/plain', size: 4 },
        invalidKey
      );
    }, 'Path traversal in storage key should throw safety error');
  });

  // Cleanup temporary test directory
  test('Cleanup temporary storage test directory', () => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
});
