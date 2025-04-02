import mongoose, { ObjectId, Types } from 'mongoose';
import { TransactionTypeEnum } from '../../infrastructure/database/schemas/transactions.schema';
import { ICurrency } from './currency';
import { IAccount } from './account';
import { ILedgerEntry } from './ledgerEntry';

export interface ITransaction {
  _id?: string;
  account: Types.ObjectId | IAccount;
  transactionType: TransactionTypeEnum;
  amount: number;
  currency: Types.ObjectId | ICurrency;
  description: string;
  timestamp: Date;
  ledgerEntry: Types.ObjectId | ILedgerEntry;
  createdAt?: Date;
  updatedAt?: Date;
}
