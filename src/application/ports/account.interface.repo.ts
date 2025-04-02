import { IAccount } from '../domain/account';
import { FilterQuery, QueryOptions } from 'mongoose';
import { IFindQueryResponse } from './types/findQuery.response';

export interface IAccountRepository {
  createAccount(account: IAccount): Promise<IAccount>;
  findById(id: string): Promise<IAccount | null>;
  findByName(accountName: string): Promise<IAccount | null>;
  seedAccountCollection(accounts: IAccount[]): Promise<void>;
  findBy(query: FilterQuery<IAccount>, options?: QueryOptions<IAccount>): Promise<IFindQueryResponse<IAccount>>;
  findOne(query: FilterQuery<IAccount>, options?: QueryOptions<IAccount>): Promise<IAccount | null>;
}
