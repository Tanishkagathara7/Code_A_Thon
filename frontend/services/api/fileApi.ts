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
  async uploadFile(fileUri: any, fileName?: string, mimeType?: string): Promise<FileUploadResponse> {
    let realUri = '';
    if (typeof fileUri === 'string') {
      realUri = fileUri;
    } else if (fileUri && typeof fileUri === 'object') {
      realUri = fileUri.uri || fileUri.path || fileUri.localUri || fileUri.fileUri || '';
    }

    if (!realUri || typeof realUri !== 'string') {
      throw new ApiError('No valid file URI provided for upload.', 400);
    }

    const token = await getStoredToken();
    const url = `${getBaseUrl()}/files`;

    const formData = new FormData();

    const finalName = typeof fileName === 'string' && fileName.trim() ? fileName.trim() : 'upload_file.jpg';
    const finalType = typeof mimeType === 'string' && mimeType.trim() ? mimeType.trim() : 'image/jpeg';

    if (Platform.OS === 'web') {
      try {
        const res = await fetch(realUri);
        const blob = await res.blob();
        formData.append('file', blob, finalName);
      } catch {
        formData.append('file', {
          uri: realUri,
          name: finalName,
          type: finalType,
        } as any);
      }
    } else {
      // React Native Mobile (Android & iOS)
      let cleanUri = realUri.trim();
      if (
        Platform.OS === 'android' &&
        !cleanUri.startsWith('content://') &&
        !cleanUri.startsWith('file://') &&
        !cleanUri.startsWith('http://') &&
        !cleanUri.startsWith('https://')
      ) {
        cleanUri = `file://${cleanUri}`;
      }

      const filePayload = {
        uri: cleanUri,
        name: finalName,
        type: finalType,
      };

      formData.append('file', filePayload as any);
    }

    // Use XMLHttpRequest for React Native 0.86 cross-platform compatibility
    const xhrResult = await new Promise<{ status: number; text: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Accept', 'application/json');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.onload = () => {
        resolve({ status: xhr.status, text: xhr.responseText });
      };

      xhr.onerror = (err) => {
        reject(new ApiError('Network request failed during file upload. Please check your connection.', 0, err));
      };

      xhr.ontimeout = () => {
        reject(new ApiError('File upload timed out. Please try again.', 0, null, 'TIMEOUT'));
      };

      xhr.send(formData);
    });

    let data: any = null;
    try {
      data = JSON.parse(xhrResult.text);
    } catch {
      data = null;
    }

    if (xhrResult.status < 200 || xhrResult.status >= 300) {
      const errorMessage =
        (typeof data === 'object' && data?.error) ||
        (typeof data === 'object' && data?.message) ||
        `Upload failed with status ${xhrResult.status}`;
      throw new ApiError(errorMessage, xhrResult.status, data);
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
