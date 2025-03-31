import mongoose from 'mongoose';
import { IBankRepository } from '../../application/ports/bank.interface.repo';
import { IBank } from '../../application/domain/bank';
import BankModel from './schemas/bank.schema';

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
    const bank = await BankModel.findOne({ id: new mongoose.Types.ObjectId(id) });
    return bank ? (bank.toObject() as unknown as IBank) : null;
  }

  async findByName(bankName: string): Promise<IBank | null> {
    const bank = await BankModel.findOne({ bankName });
    return bank ? (bank.toObject() as unknown as IBank) : null;
  }
}
