import mongoose from 'mongoose';
import { IAccount } from './account';
import { ICurrency } from './currency';

export interface ILedgerEntry {
  _id?: string;
  debitAccountId: mongoose.Types.ObjectId | IAccount;
  creditAccountId: mongoose.Types.ObjectId | IAccount;
  amount: number;
  currency: mongoose.Types.ObjectId | ICurrency;
  description: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
