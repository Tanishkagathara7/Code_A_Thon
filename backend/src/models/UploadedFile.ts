import mongoose, { Schema, Document } from 'mongoose';

export interface IUploadedFile extends Document {
  owner: mongoose.Types.ObjectId;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  storageProvider: string;
  storageKey: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const UploadedFileSchema: Schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    storedName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    storageProvider: {
      type: String,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UploadedFileSchema.index({ createdAt: -1 });

export const UploadedFile = mongoose.model<IUploadedFile>('UploadedFile', UploadedFileSchema);
