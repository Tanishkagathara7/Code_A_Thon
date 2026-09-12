import { IStorageProvider, StorageUploadInput, UploadResult } from './storage.types';
import { LocalDevStorageProvider } from './storage.provider';

export class StorageService {
  private provider: IStorageProvider;

  constructor(provider?: IStorageProvider) {
    this.provider = provider || new LocalDevStorageProvider();
  }

  public setProvider(provider: IStorageProvider): void {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.providerName;
  }

  public async upload(input: StorageUploadInput, storageKey: string): Promise<UploadResult> {
    return this.provider.uploadFile(input, storageKey);
  }

  public async delete(storageKey: string): Promise<boolean> {
    return this.provider.deleteFile(storageKey);
  }

  public async getUrl(storageKey: string): Promise<string> {
    return this.provider.getFileUrl(storageKey);
  }

  public async exists(storageKey: string): Promise<boolean> {
    return this.provider.fileExists(storageKey);
  }

  public getFilePath(storageKey: string): string | null {
    if (this.provider.getFilePath) {
      return this.provider.getFilePath(storageKey);
    }
    return null;
  }
}

export const storageService = new StorageService();
