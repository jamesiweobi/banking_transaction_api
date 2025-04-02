import mongoose, { Schema } from 'mongoose';

const ledgerEntrySchema = new Schema(
  {
    debitAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    creditAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
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
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('LedgerEntry', ledgerEntrySchema);
