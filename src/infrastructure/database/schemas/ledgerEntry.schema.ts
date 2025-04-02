import mongoose, { Schema } from 'mongoose';

const ledgerEntrySchema = new Schema(
  {
    debitAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: false,
    },
    creditAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: false,
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
      required: false,
    },
    timestamp: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('LedgerEntry', ledgerEntrySchema);
