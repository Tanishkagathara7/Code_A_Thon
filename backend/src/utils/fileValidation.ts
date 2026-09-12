import crypto from 'crypto';
import path from 'path';

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20 MB

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const ALLOWED_DOCUMENT_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
};

export const ALLOWED_MIME_TYPES = {
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
};

export const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'php', 'js', 'py', 'vbs', 'ps1',
  'dll', 'so', 'cgi', 'pl', 'jar', 'msi', 'com', 'scr', 'htc',
  'asp', 'aspx', 'jsp', 'bash', 'zsh', 'app', 'apk'
]);

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedExt?: string;
}

/**
 * Validates buffer magic bytes against expected MIME signatures.
 */
export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  switch (mimeType) {
    case 'image/jpeg':
      // FF D8 FF
      return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

    case 'image/png':
      // 89 50 4E 47 0D 0A 1A 0A
      return (
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4E &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0D &&
        buffer[5] === 0x0A &&
        buffer[6] === 0x1A &&
        buffer[7] === 0x0A
      );

    case 'image/webp':
      // RIFF....WEBP -> 52 49 46 46 .... 57 45 42 50
      return (
        buffer.length >= 12 &&
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
      );

    case 'application/pdf':
      // %PDF- -> 25 50 44 46 2D
      return (
        buffer[0] === 0x25 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x44 &&
        buffer[3] === 0x46 &&
        buffer[4] === 0x2D
      );

    default:
      return false;
  }
}

/**
 * Comprehensive file validation: size, extension, MIME type, magic bytes.
 */
export function validateUploadedFile(
  file: { originalname: string; mimetype: string; size: number; buffer: Buffer }
): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const rawExt = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (DANGEROUS_EXTENSIONS.has(rawExt)) {
    return { valid: false, error: `File type .${rawExt} is blocked for security reasons.` };
  }

  const expectedExt = ALLOWED_MIME_TYPES[file.mimetype];
  if (!expectedExt) {
    return { valid: false, error: `Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, PDF.` };
  }

  const isImage = file.mimetype in ALLOWED_IMAGE_TYPES;
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE;

  if (file.size > maxSize) {
    const limitMb = isImage ? '10MB' : '20MB';
    return { valid: false, error: `File size exceeds maximum limit of ${limitMb}.` };
  }

  if (!validateMagicBytes(file.buffer, file.mimetype)) {
    return { valid: false, error: 'File contents do not match the expected format (MIME spoofing detected).' };
  }

  return { valid: true, sanitizedExt: expectedExt };
}

/**
 * Generates a safe storage key that prevents path traversal and filename collisions.
 * Format: {userId}/{uuid}.{ext}
 */
export function generateSafeStorageKey(userId: string, ext: string): string {
  const safeUserId = userId.replace(/[^a-zA-Z0-9]/g, '');
  const uniqueId = crypto.randomUUID();
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '');
  return `${safeUserId}/${uniqueId}.${safeExt}`;
}

/**
 * Sanitizes original filename for metadata display.
 */
export function sanitizeOriginalFilename(filename: string): string {
  const basename = path.basename(filename);
  return basename.replace(/[^\w\s.-]/g, '_').trim();
}
