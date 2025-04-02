import mongoose from 'mongoose';
import { IAccount } from './account';
import { ICurrency } from './currency';

export interface ILedgerEntry {
  _id?: string;
  debitAccount?: mongoose.Types.ObjectId | IAccount;
  creditAccount: mongoose.Types.ObjectId | IAccount;
  amount: number;
  balance: number;
  currency: mongoose.Types.ObjectId | ICurrency;
  description: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
