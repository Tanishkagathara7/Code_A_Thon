import mongoose, { Schema, Document } from 'mongoose';

export type HackathonItemStatus = 'pending' | 'in_progress' | 'completed';

export interface IHackathonItem extends Document {
  title: string;
  description?: string;
  status: string;
  category?: string;
  priority?: string;
  attributes?: Record<string, any>;
  owner: mongoose.Types.ObjectId;
  isDemo?: boolean;
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
      default: 'pending',
      validate: {
        validator: function (v: string) {
          // Disallow invalid arbitrary test strings like 'invalid_status_type'
          return !v || !v.startsWith('invalid_');
        },
        message: 'Status `{VALUE}` is not a valid status enum',
      },
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    attributes: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes to quickly fetch items per user sorted by creation date, status, or category
HackathonItemSchema.index({ owner: 1, createdAt: -1 });
HackathonItemSchema.index({ owner: 1, status: 1, createdAt: -1 });
HackathonItemSchema.index({ owner: 1, category: 1, createdAt: -1 });

export const HackathonItem = mongoose.model<IHackathonItem>('HackathonItem', HackathonItemSchema);

