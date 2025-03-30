import mongoose, { Schema } from 'mongoose';
import { AccountStatusEnum } from './accountStatusHistory.schema';

const accountSchema = new Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0.0,
      required: true,
    },
    accountOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AccountStatusEnum),
      default: AccountStatusEnum.ACTIVE,
    },
    currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
    accountType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccountType',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Account', accountSchema);
