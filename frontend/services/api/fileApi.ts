import { Platform } from 'react-native';
import { getStoredToken } from '../../context/AuthContext';
import { ApiError } from '../../types/domain';
import { UploadedFile, FileUploadResponse } from '../../types/file';
import { apiClient } from './apiClient';

const getBaseUrl = (): string => {
  return process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
};

export const fileApi = {
  /**
   * Upload a file using multipart/form-data
   */
  async uploadFile(fileUri: string, fileName: string, mimeType: string): Promise<FileUploadResponse> {
    const token = await getStoredToken();
    const url = `${getBaseUrl()}/files`;

    const formData = new FormData();

    // Cross-platform FormData handling (Web vs Mobile Native)
    if (Platform.OS === 'web' && (fileUri.startsWith('blob:') || fileUri.startsWith('data:') || fileUri.startsWith('http'))) {
      try {
        const res = await fetch(fileUri);
        const blob = await res.blob();
        formData.append('file', blob, fileName || 'upload_file');
      } catch {
        formData.append('file', {
          uri: fileUri,
          name: fileName || 'upload_file',
          type: mimeType || 'application/octet-stream',
        } as any);
      }
    } else {
      formData.append('file', {
        uri: fileUri,
        name: fileName || 'upload_file',
        type: mimeType || 'application/octet-stream',
      } as any);
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
    } catch (err: any) {
      throw new ApiError(
        err.message || 'Network request failed during file upload. Please check your connection.',
        0,
        err
      );
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && data?.error) ||
        (typeof data === 'object' && data?.message) ||
        `Upload failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as FileUploadResponse;
  },

  /**
   * Get metadata for an uploaded file
   */
  async getFile(id: string): Promise<{ success: boolean; data: UploadedFile }> {
    return apiClient.get<{ success: boolean; data: UploadedFile }>(`/files/${id}`);
  },

  /**
   * Delete an uploaded file
   */
  async deleteFile(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/files/${id}`);
  },
};
