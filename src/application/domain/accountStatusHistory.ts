import mongoose from 'mongoose';
import { IUser } from './user';
import { IAccount } from './account';
import { AccountStatusEnum } from '../../infrastructure/database/schemas/accountStatusHistory.schema';

export interface IAccountStatusHistory {
  _id?: mongoose.Types.ObjectId;
  status: AccountStatusEnum;
  accountOwner: mongoose.Types.ObjectId | IUser;
  account: mongoose.Types.ObjectId | IAccount;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateAccountHistory = {
  status: AccountStatusEnum;
  accountOwner: mongoose.Types.ObjectId | IUser;
  account: mongoose.Types.ObjectId | IAccount;
};
