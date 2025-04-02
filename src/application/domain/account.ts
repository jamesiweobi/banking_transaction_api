import mongoose from 'mongoose';
import { IUser } from './user';
import { IAccountType } from './accountType';
import { ICurrency } from './currency';
import { IBank } from './bank';
import { AccountStatusEnum } from '../../infrastructure/database/schemas/accountStatusHistory.schema';

export interface IAccount {
  _id?: string;
  accountNumber: String;
  balance: Number;
  accountOwner: mongoose.Types.ObjectId | IUser;
  currency: mongoose.Types.ObjectId | ICurrency;
  accountType: mongoose.Types.ObjectId | IAccountType;
  bank: mongoose.Types.ObjectId | IBank;
  status: AccountStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
