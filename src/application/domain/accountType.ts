import mongoose from 'mongoose';

export interface IAccountType {
  _id?: mongoose.Types.ObjectId;
  typeName: String;
  description: String;
  features: String[];
  createdAt?: Date;
  updatedAt?: Date;
}
