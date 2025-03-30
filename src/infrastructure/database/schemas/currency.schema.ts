import mongoose, { Schema } from 'mongoose';

const currencySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 3,
    },
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
    },
    decimalPlaces: {
      type: Number,
      default: 2,
      min: 0,
      max: 4,
    },
    isFiat: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Currency', currencySchema);
