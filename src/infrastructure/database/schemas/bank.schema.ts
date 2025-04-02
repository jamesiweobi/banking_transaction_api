import mongoose, { Schema } from 'mongoose';

const bankSchema = new Schema(
  {
    bankName: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    bankCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    sortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Bank', bankSchema);
