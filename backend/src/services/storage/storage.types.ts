export interface StorageUploadInput {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadResult {
  provider: string;
  storageKey: string;
  url: string;
  bytesWritten: number;
}

/**
 * Storage Abstraction Provider Interface.
 * Implementations must avoid binding application business logic to vendor-specific SDKs.
 */
export interface IStorageProvider {
  readonly providerName: string;
  uploadFile(input: StorageUploadInput, storageKey: string): Promise<UploadResult>;
  deleteFile(storageKey: string): Promise<boolean>;
  getFileUrl(storageKey: string): Promise<string>;
  fileExists(storageKey: string): Promise<boolean>;
  getFilePath?(storageKey: string): string;
}
