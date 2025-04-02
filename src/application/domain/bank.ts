import mongoose from 'mongoose';

export interface IBank {
  _id?: mongoose.Types.ObjectId;
  bankName: string;
  sortCode: string;
  bankCode: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}
