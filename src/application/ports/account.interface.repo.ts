import { IAccount } from '../domain/account';
import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { IFindQueryResponse } from './types/findQuery.response';

export interface IAccountRepository {
  createAccount(account: IAccount, session: mongoose.ClientSession): Promise<IAccount>;
  findById(id: string): Promise<IAccount | null>;
  findByIdAndUpdate(
    id: string,
    updateObject: UpdateQuery<IAccount>,
    session: mongoose.ClientSession,
  ): Promise<IAccount | null>;
  findByName(accountName: string): Promise<IAccount | null>;
  seedAccountCollection(accounts: IAccount[]): Promise<void>;
  findBy(query: FilterQuery<IAccount>, options?: QueryOptions<IAccount>): Promise<IFindQueryResponse<IAccount>>;
  findOne(query: FilterQuery<IAccount>, options?: QueryOptions<IAccount>): Promise<IAccount | null>;
}
