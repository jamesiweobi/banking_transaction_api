import { ObjectId } from 'mongoose';
import { IUser } from './user';
import { IAccount } from './account';
import { AccountStatusEnum } from '../../infrastructure/database/schemas/accountStatusHistory.schema';

export interface IAccountStatusHistory {
  id?: string;
  status: AccountStatusEnum;
  accountOwner: ObjectId | IUser;
  account: ObjectId | IAccount;
  createdAt?: Date;
  updatedAt?: Date;
}
