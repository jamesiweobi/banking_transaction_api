import mongoose from 'mongoose';
import TransactionModel from './schemas/transactions.schema';
import { IFindQueryResponse } from '../../application/ports/types/findQuery.response';
import { ITransactionRepository } from '../../application/ports/transaction.interface.repo';
import { ITransaction } from '../../application/domain/transaction';

export class MongoTransactionRepository implements ITransactionRepository {
  async createTransaction(transaction: ITransaction): Promise<ITransaction> {
    const newtransaction = new TransactionModel(transaction);
    const savedtransaction = await newtransaction.save();
    const hydratedtransaction = savedtransaction.toObject() as unknown as ITransaction;
    return hydratedtransaction;
  }

  async findById(id: string): Promise<ITransaction | null> {
    const transaction = await TransactionModel.findById(id);
    return transaction ? (transaction.toObject() as unknown as ITransaction) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<ITransaction>,
    options: mongoose.QueryOptions<ITransaction>,
  ): Promise<IFindQueryResponse<ITransaction>> {
    const { limit, sort, skip } = options;
    const [data, total] = await Promise.all([
      TransactionModel.find(query).limit(limit!).skip(skip!).sort(sort!).exec(),
      TransactionModel.countDocuments(query),
    ]);
    const page = Math.floor(skip! / limit!) + 1;
    const totalPages = Math.ceil(total / limit!);
    return {
      data: data.map((transaction) => transaction.toObject() as unknown as ITransaction),
      total,
      pagination: {
        limit: limit!,
        skip: skip!,
        page,
        totalPages,
      },
    };
  }
}
