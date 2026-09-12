import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { AuthenticatedRequest } from '../middleware/auth';
import { UploadedFile } from '../models/UploadedFile';
import { storageService } from '../services/storage';
import {
  validateUploadedFile,
  generateSafeStorageKey,
  sanitizeOriginalFilename,
} from '../utils/fileValidation';

export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided in form field "file".' });
    }

    const validation = validateUploadedFile(file);
    if (!validation.valid || !validation.sanitizedExt) {
      return res.status(400).json({ success: false, error: validation.error || 'Invalid file upload.' });
    }

    const userId = req.user.id;
    const storageKey = generateSafeStorageKey(userId, validation.sanitizedExt);
    const sanitizedName = sanitizeOriginalFilename(file.originalname);

    // Upload via Storage Service abstraction
    const uploadResult = await storageService.upload(
      {
        buffer: file.buffer,
        originalname: sanitizedName,
        mimetype: file.mimetype,
        size: file.size,
      },
      storageKey
    );

    // Persist file metadata in MongoDB
    const uploadedFile = await UploadedFile.create({
      owner: userId,
      originalName: sanitizedName,
      storedName: path.basename(storageKey),
      mimeType: file.mimetype,
      size: file.size,
      storageProvider: uploadResult.provider,
      storageKey: storageKey,
      url: `/api/files/${storageKey}`,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: uploadedFile._id.toString(),
        originalName: uploadedFile.originalName,
        mimeType: uploadedFile.mimeType,
        size: uploadedFile.size,
        url: `/api/files/${uploadedFile._id.toString()}`,
        downloadUrl: `/api/files/download/${encodeURIComponent(storageKey)}`,
        createdAt: uploadedFile.createdAt,
      },
    });
  } catch (error: any) {
    console.error('❌ File upload error:', error);
    return res.status(500).json({ success: false, error: error.message || 'File upload failed.' });
  }
};

export const getFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const fileId = req.params.id;
    const fileDoc = await UploadedFile.findById(fileId);

    if (!fileDoc) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    // Ownership Enforcement
    if (fileDoc.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied. You do not own this file.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: fileDoc._id.toString(),
        originalName: fileDoc.originalName,
        storedName: fileDoc.storedName,
        mimeType: fileDoc.mimeType,
        size: fileDoc.size,
        storageProvider: fileDoc.storageProvider,
        url: `/api/files/${fileDoc._id.toString()}`,
        downloadUrl: `/api/files/download/${encodeURIComponent(fileDoc.storageKey)}`,
        createdAt: fileDoc.createdAt,
        updatedAt: fileDoc.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('❌ Get file error:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve file metadata.' });
  }
};

export const downloadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const rawParam = req.params[0] || req.params.storageKey;
    const rawKey = Array.isArray(rawParam) ? rawParam[0] : (rawParam || '');
    const storageKey = decodeURIComponent(rawKey);

    const fileDoc = await UploadedFile.findOne({ storageKey });
    if (!fileDoc) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    if (fileDoc.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied. You do not own this file.' });
    }

    const filePath = storageService.getFilePath(storageKey);
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File content not found in storage.' });
    }

    res.setHeader('Content-Type', fileDoc.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileDoc.originalName)}"`);
    return res.sendFile(filePath);
  } catch (error: any) {
    console.error('❌ Download file error:', error);
    return res.status(500).json({ success: false, error: 'Failed to download file.' });
  }
};

export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const fileId = req.params.id;
    const fileDoc = await UploadedFile.findById(fileId);

    if (!fileDoc) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    // Ownership Enforcement
    if (fileDoc.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied. You do not own this file.' });
    }

    // Delete from storage provider first
    try {
      await storageService.delete(fileDoc.storageKey);
    } catch (storageError) {
      console.error('❌ Storage deletion failed:', storageError);
      return res.status(500).json({ success: false, error: 'Failed to delete storage file.' });
    }

    // Delete database record after storage deletion succeeds
    await UploadedFile.findByIdAndDelete(fileId);

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully.',
      data: { id: fileId },
    });
  } catch (error: any) {
    console.error('❌ Delete file error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete file.' });
  }
};
