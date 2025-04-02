import mongoose from 'mongoose';
import { IAccount } from './account';
import { ICurrency } from './currency';

export interface ILedgerEntry {
  _id?: mongoose.Types.ObjectId;
  debitAccount?: mongoose.Types.ObjectId | IAccount;
  creditAccount?: mongoose.Types.ObjectId | IAccount;
  amount: number;
  currency: mongoose.Types.ObjectId | ICurrency;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
