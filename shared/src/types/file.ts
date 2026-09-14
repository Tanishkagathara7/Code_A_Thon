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

export interface FileUploadResponse {
  success: boolean;
  data: UploadedFile;
  message?: string;
}
