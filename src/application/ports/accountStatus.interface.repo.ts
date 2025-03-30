import { FilterQuery, QueryOptions } from 'mongoose';
import { IFindQueryResponse } from './types/findQuery.response';
import { IAccountStatusHistory } from '../domain/accountStatusHistory';

export interface IAccountStatusHistoryRepository {
  createAccountStatus(account: IAccountStatusHistory): Promise<IAccountStatusHistory>;
  findById(id: string): Promise<IAccountStatusHistory | null>;
  findBy(
    query: FilterQuery<IAccountStatusHistory>,
    options?: QueryOptions<IAccountStatusHistory>,
  ): Promise<IFindQueryResponse<IAccountStatusHistory>>;
}
