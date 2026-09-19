import mongoose, { Schema, Document } from 'mongoose';

export type GSTApplicability = 'taxable' | 'exempt' | 'non_gst';
export type UnitOfMeasurement = 'piece' | 'kg' | 'gram' | 'litre' | 'metre' | 'box' | 'pack';

export interface IProduct extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  sku?: string;
  hsnCode?: string;
  category?: string;
  brand?: string;
  description?: string;
  unit: UnitOfMeasurement;
  purchasePrice?: number;
  sellingPrice: number;
  isTaxInclusive?: boolean;
  gstApplicability: GSTApplicability;
  gstRate: number; // 0, 5, 12, 18, 28
  currentStock: number;
  openingStock: number;
  minStockAlert: number;
  trackInventory: boolean;
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const ProductSchema: Schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    sku: {
      type: String,
      trim: true,
      maxlength: [50, 'SKU cannot exceed 50 characters'],
    },
    hsnCode: {
      type: String,
      trim: true,
      default: '1006',
      maxlength: [20, 'HSN/SAC code cannot exceed 20 characters'],
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      maxlength: [60, 'Category cannot exceed 60 characters'],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [60, 'Brand cannot exceed 60 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    unit: {
      type: String,
      enum: ['piece', 'kg', 'gram', 'litre', 'metre', 'box', 'pack'],
      default: 'piece',
    },
    purchasePrice: {
      type: Number,
      min: [0, 'Purchase price cannot be negative'],
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    isTaxInclusive: {
      type: Boolean,
      default: false,
    },
    gstApplicability: {
      type: String,
      enum: ['taxable', 'exempt', 'non_gst'],
      default: 'taxable',
    },
    gstRate: {
      type: Number,
      enum: [0, 5, 12, 18, 28],
      default: 18,
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    openingStock: {
      type: Number,
      default: 0,
      min: [0, 'Opening stock cannot be negative'],
    },
    minStockAlert: {
      type: Number,
      default: 5,
      min: [0, 'Reorder level cannot be negative'],
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Derived virtual stockStatus
ProductSchema.virtual('stockStatus').get(function (this: IProduct) {
  if (!this.trackInventory) return 'in_stock';
  if (this.currentStock <= 0) return 'out_of_stock';
  if (this.currentStock <= (this.minStockAlert || 5)) return 'low_stock';
  return 'in_stock';
});

// Compound indexes for performant search, sorting, and user isolation
ProductSchema.index({ owner: 1, name: 1 });
ProductSchema.index({ owner: 1, sku: 1 });
ProductSchema.index({ owner: 1, category: 1 });
ProductSchema.index({ owner: 1, currentStock: 1 });
ProductSchema.index({ owner: 1, createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
