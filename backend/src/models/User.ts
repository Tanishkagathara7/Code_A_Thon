import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash?: string;
  avatarUrl?: string;
  provider: 'email' | 'google' | 'github';
  providerId?: string;
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['email', 'google', 'github'],
      default: 'email',
    },
    providerId: {
      type: String,
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ provider: 1, providerId: 1 }, { sparse: true });

export const User = mongoose.model<IUser>('User', UserSchema);
