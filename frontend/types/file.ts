import { SingleResponse } from './domain';

export interface UploadedFile {
  id: string;
  originalName: string;
  storedName?: string;
  mimeType: string;
  size: number;
  storageProvider?: string;
  url: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UploadState = 'idle' | 'selecting' | 'selected' | 'uploading' | 'success' | 'error';

export type SupportedFileType = 'image' | 'document' | 'all';

export interface FileSelection {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
  base64?: string;
}

export type FileUploadResponse = SingleResponse<UploadedFile>;
