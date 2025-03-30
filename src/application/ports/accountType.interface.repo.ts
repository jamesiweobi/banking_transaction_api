import { FilterQuery, QueryOptions } from 'mongoose';
import { IFindQueryResponse } from './types/findQuery.response';
import { IAccountType } from '../domain/accountType';

export interface IAccountTypeRepository {
  createAccountType(accountType: IAccountType): Promise<IAccountType>;
  findById(id: string): Promise<IAccountType | null>;
  seedAccountTypeCollection(accountTypes: IAccountType[]): Promise<void>;
}
