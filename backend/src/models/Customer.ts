import mongoose, { Schema, Document } from 'mongoose';

export type CustomerType = 'individual' | 'business';

export interface ICustomer extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  mobile: string;
  email?: string;
  customerType: CustomerType;
  gstin?: string;
  businessName?: string;
  address?: string;
  city?: string;
  state: string;
  stateCode?: string;
  pincode?: string;
  notes?: string;
  isActive: boolean;
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      maxlength: [20, 'Mobile number cannot exceed 20 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [100, 'Email cannot exceed 100 characters'],
    },
    customerType: {
      type: String,
      enum: ['individual', 'business'],
      default: 'business',
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [15, 'GSTIN cannot exceed 15 characters'],
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [150, 'Business name cannot exceed 150 characters'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [60, 'City cannot exceed 60 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      default: 'Gujarat',
      trim: true,
    },
    stateCode: {
      type: String,
      trim: true,
      maxlength: [5, 'State code cannot exceed 5 characters'],
    },
    pincode: {
      type: String,
      trim: true,
      maxlength: [10, 'Pincode cannot exceed 10 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Indexes
CustomerSchema.index({ owner: 1, mobile: 1 });
CustomerSchema.index({ owner: 1, name: 1 });
CustomerSchema.index({ owner: 1, gstin: 1 });
CustomerSchema.index({ owner: 1, createdAt: -1 });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
