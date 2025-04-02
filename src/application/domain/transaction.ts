import mongoose, { ObjectId, Types } from 'mongoose';
import { TransactionTypeEnum } from '../../infrastructure/database/schemas/transactions.schema';
import { ICurrency } from './currency';
import { IAccount } from './account';
import { ILedgerEntry } from './ledgerEntry';
import { IUser } from './user';

export interface ITransaction {
  _id?: string;
  account: Types.ObjectId | IAccount;
  transactionType: TransactionTypeEnum;
  amount: number;
  currency: Types.ObjectId | ICurrency;
  description: string;
  timestamp: Date;
  ledgerEntry: Types.ObjectId | ILedgerEntry;
  accountOwner: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTransactionDto {
  account: Types.ObjectId;
  transactionType: TransactionTypeEnum;
  amount: number;
  currency: Types.ObjectId;
  description: string;
  timestamp: Date;
  accountOwner: Types.ObjectId;
  debitAccount?: Types.ObjectId;
}

export interface CreateDepositTransactionDto {
  account: Types.ObjectId;
  amount: number;
  currency: Types.ObjectId;
  description: string;
  accountOwner: Types.ObjectId;
}

export interface CreateWithDrawalTransactionDto {
  account: Types.ObjectId;
  amount: number;
  currency: Types.ObjectId;
  description: string;
  accountOwner: Types.ObjectId;
  debitAccount?: Types.ObjectId;
}
