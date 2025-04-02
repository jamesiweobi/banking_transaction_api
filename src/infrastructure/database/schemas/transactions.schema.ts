import mongoose, { Schema } from 'mongoose';

export enum TransactionTypeEnum {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

const transactionSchema = new Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionTypeEnum),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    ledgerEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LedgerEntry',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Transaction', transactionSchema);
