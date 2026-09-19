import mongoose, { Schema, Document } from 'mongoose';

export type StockOperationType =
  | 'initial'
  | 'purchase_increase'
  | 'sale_deduction'
  | 'manual_increase'
  | 'manual_decrease'
  | 'damage'
  | 'return';

export interface IStockHistory extends Document {
  product: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  operationType: StockOperationType;
  previousQuantity: number;
  quantityDelta: number;
  newQuantity: number;
  reason: string;
  referenceInvoiceNo?: string;
  createdAt: Date;
}

const StockHistorySchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    operationType: {
      type: String,
      enum: [
        'initial',
        'purchase_increase',
        'sale_deduction',
        'manual_increase',
        'manual_decrease',
        'damage',
        'return',
      ],
      required: [true, 'Operation type is required'],
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    quantityDelta: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Adjustment reason is required'],
      trim: true,
      maxlength: [300, 'Reason cannot exceed 300 characters'],
    },
    referenceInvoiceNo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

StockHistorySchema.index({ product: 1, createdAt: -1 });
StockHistorySchema.index({ owner: 1, createdAt: -1 });

export const StockHistory = mongoose.model<IStockHistory>('StockHistory', StockHistorySchema);
