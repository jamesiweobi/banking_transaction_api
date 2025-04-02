import mongoose from 'mongoose';
import { IBankRepository } from '../../application/ports/bank.interface.repo';
import { IBank } from '../../application/domain/bank';
import BankModel from './schemas/bank.schema';
import { IFindQueryResponse } from '../../application/ports/types/findQuery.response';

export class MongoBankRepository implements IBankRepository {
  async createBank(bank: IBank): Promise<IBank> {
    const newbank = new BankModel(bank);
    const savedbank = await newbank.save();
    const hydratedbank = savedbank.toObject() as unknown as IBank;
    return hydratedbank;
  }

  async seedBankCollection(banks: IBank[]): Promise<void> {
    await BankModel.insertMany(banks);
  }

  async findById(id: string): Promise<IBank | null> {
    const bank = await BankModel.findById(id);
    return bank ? (bank.toObject() as unknown as IBank) : null;
  }

  async findByName(bankName: string): Promise<IBank | null> {
    const bank = await BankModel.findOne({ bankName });
    return bank ? (bank.toObject() as unknown as IBank) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<IBank>,
    options: mongoose.QueryOptions<IBank>,
  ): Promise<IFindQueryResponse<IBank>> {
    const { limit, sort, skip } = options;
    const [data, total] = await Promise.all([
      BankModel.find(query).limit(limit!).skip(skip!).sort(sort!).exec(),
      BankModel.countDocuments(query),
    ]);
    const page = Math.floor(skip! / limit!) + 1;
    const totalPages = Math.ceil(total / limit!);
    return {
      data: data.map((account) => account.toObject() as unknown as IBank),
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
