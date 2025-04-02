import mongoose, { Schema } from 'mongoose';

const accountTypeSchema = new Schema(
  {
    typeName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    features: {
      type: [String],
    },
  },
  { timestamps: true },
);

export default mongoose.model('AccountType', accountTypeSchema);
