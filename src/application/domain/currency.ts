import mongoose from 'mongoose';

export interface ICurrency {
  _id?: mongoose.Types.ObjectId;
  code: String;
  name: String;
  symbol: String;
  decimalPlaces: Number;
  isFiat: Boolean;
}
