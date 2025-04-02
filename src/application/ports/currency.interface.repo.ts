import { FilterQuery, QueryOptions } from 'mongoose';
import { IFindQueryResponse } from './types/findQuery.response';
import { ICurrency } from '../domain/currency';

export interface ICurrencyRepository {
  createCurrency(account: ICurrency): Promise<ICurrency>;
  findById(id: string): Promise<ICurrency | null>;
  seedCurrencyCollection(accounts: ICurrency[]): Promise<void>;
  findBy(query: FilterQuery<ICurrency>, options?: QueryOptions<ICurrency>): Promise<IFindQueryResponse<ICurrency>>;
}
