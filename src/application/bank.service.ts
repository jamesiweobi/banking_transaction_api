import { MongoBankRepository } from '../infrastructure/database/mongo.bank.repo';
import { IBank } from './domain/bank';
import { NotFoundError } from '../errors/notFound.error';
import * as fs from 'fs';
import * as path from 'path';
import { AppError } from '../errors/appError.error';
import mongoose from 'mongoose';
import { ICurrency } from './domain/currency';

export class BankService {
  constructor(private bankRepository: MongoBankRepository) {}

  async findById(_id: string): Promise<IBank> {
    const bank = await this.bankRepository.findById(_id);
    if (!bank) {
      throw new NotFoundError('Bank not found');
    }
    return bank;
  }

  async seedBankCollections(): Promise<void> {
    const banksPath = path.resolve(__dirname, '../infrastructure/seed-data/banks.json');
    console.log(`Seed Bank`, __dirname, '../infrastructure/seed-data/banks.json');
    const banksData = JSON.parse(fs.readFileSync(banksPath, 'utf8'));
    if (banksData.length > 0) {
      await this.bankRepository.seedBankCollection(banksData);
    } else {
      throw new AppError('No banksfound in the seed-data/banks.json file');
    }
  }

  async getBankList(query: mongoose.FilterQuery<IBank>, options: mongoose.QueryOptions<IBank>) {
    return await this.bankRepository.findBy(query, options);
  }
}
