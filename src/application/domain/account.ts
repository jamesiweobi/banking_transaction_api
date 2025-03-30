import mongoose, { ObjectId } from 'mongoose';
import { IUser } from './user';
import { IAccountType } from './accountType';
import { ICurrency } from './currency';

export interface IAccount {
  id?: string;
  accountNumber: String;
  balance: Number;
  accountOwner: ObjectId | IUser;
  currency: ObjectId | ICurrency;
  accountType: ObjectId | IAccountType;
  createdAt?: Date;
  updatedAt?: Date;
}
