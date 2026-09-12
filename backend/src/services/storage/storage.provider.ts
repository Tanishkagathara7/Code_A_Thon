import fs from 'fs';
import path from 'path';
import { IStorageProvider, StorageUploadInput, UploadResult } from './storage.types';

/**
 * DEVELOPMENT ONLY STORAGE PROVIDER
 *
 * IMPORTANT & WARNING:
 * Render backend instance filesystems are EPHEMERAL and NOT SUITABLE for permanent production file storage.
 * This LocalDevStorageProvider is provided exclusively for local development and unit testing.
 * Production environments MUST configure a persistent cloud storage provider (e.g. AWS S3, Cloudinary).
 */
export class LocalDevStorageProvider implements IStorageProvider {
  readonly providerName = 'local_dev';
  private uploadDir: string;

  constructor(customUploadDir?: string) {
    this.uploadDir = customUploadDir || path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(input: StorageUploadInput, storageKey: string): Promise<UploadResult> {
    const fullPath = path.resolve(this.uploadDir, storageKey);
    const dir = path.dirname(fullPath);
    
    // Prevent path traversal outside uploadDir
    if (!fullPath.startsWith(path.resolve(this.uploadDir))) {
      throw new Error('Path traversal detected in storage key');
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(fullPath, input.buffer);

    return {
      provider: this.providerName,
      storageKey,
      url: `/api/files/download/${encodeURIComponent(storageKey)}`,
      bytesWritten: input.buffer.length,
    };
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    const fullPath = path.resolve(this.uploadDir, storageKey);
    
    if (!fullPath.startsWith(path.resolve(this.uploadDir))) {
      throw new Error('Path traversal detected in storage key');
    }

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  }

  async getFileUrl(storageKey: string): Promise<string> {
    return `/api/files/download/${encodeURIComponent(storageKey)}`;
  }

  async fileExists(storageKey: string): Promise<boolean> {
    const fullPath = path.resolve(this.uploadDir, storageKey);
    if (!fullPath.startsWith(path.resolve(this.uploadDir))) {
      return false;
    }
    return fs.existsSync(fullPath);
  }

  getFilePath(storageKey: string): string {
    const fullPath = path.resolve(this.uploadDir, storageKey);
    if (!fullPath.startsWith(path.resolve(this.uploadDir))) {
      throw new Error('Path traversal detected');
    }
    return fullPath;
  }
}
