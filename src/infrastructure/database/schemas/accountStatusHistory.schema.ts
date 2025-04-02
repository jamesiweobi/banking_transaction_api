import mongoose, { Schema } from 'mongoose';

export enum AccountStatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  FROZEN = 'FROZEN',
  CLOSED = 'CLOSED',
  DORMANT = 'DORMANT',
  BLOCKED = 'BLOCKED',
}

const accountStatusHistorychema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(AccountStatusEnum),
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    accountOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('AccountStatusHistory', accountStatusHistorychema);
