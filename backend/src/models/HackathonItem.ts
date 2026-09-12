import mongoose, { Schema, Document } from 'mongoose';

export type HackathonItemStatus = 'pending' | 'in_progress' | 'completed';

export interface IHackathonItem extends Document {
  title: string;
  description?: string;
  status: HackathonItemStatus;
  category?: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HackathonItemSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed'],
        message: 'Status must be one of: pending, in_progress, completed',
      },
      default: 'pending',
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch items per user sorted by creation date
HackathonItemSchema.index({ owner: 1, createdAt: -1 });

export const HackathonItem = mongoose.model<IHackathonItem>('HackathonItem', HackathonItemSchema);
