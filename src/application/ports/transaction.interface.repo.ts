import mongoose, { FilterQuery, QueryOptions } from 'mongoose';
import { IFindQueryResponse } from './types/findQuery.response';
import { CreateTransactionDto, ITransaction } from '../domain/transaction';

export interface ITransactionRepository {
  createTransaction(transaction: CreateTransactionDto, session: mongoose.ClientSession): Promise<ITransaction>;
  findById(id: string): Promise<ITransaction | null>;
  findBy(
    query: FilterQuery<ITransaction>,
    options?: QueryOptions<ITransaction>,
  ): Promise<IFindQueryResponse<ITransaction>>;
}
