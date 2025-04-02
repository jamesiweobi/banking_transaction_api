import mongoose from 'mongoose';
import { AppError } from '../errors/appError.error';
import { NotFoundError } from '../errors/notFound.error';
import { MongoAccountTypeRepository } from '../infrastructure/database/mongo.accountType.repo';
import { IAccountType } from './domain/accountType';
import * as fs from 'fs';
import * as path from 'path';

export class AccountTypeService {
  constructor(private accountTypeRepository: MongoAccountTypeRepository) {}

  async findById(_id: string): Promise<IAccountType> {
    const accountType = await this.accountTypeRepository.findById(_id);
    if (!accountType) {
      throw new NotFoundError('AccountType not found');
    }
    return accountType;
  }

  async seedAccountTypeCollections(): Promise<void> {
    const accountTypesPath = path.resolve(__dirname, '../infrastructure/seed-data/accountTypes.json');
    const accountTypesData = JSON.parse(fs.readFileSync(accountTypesPath, 'utf8'));
    if (accountTypesData.length > 0) {
      await this.accountTypeRepository.seedAccountTypeCollection(accountTypesData);
    } else {
      throw new AppError('No account types found in the seed-data/accountTypes.json file');
    }
  }

  async getAccountTypeList(query: mongoose.FilterQuery<IAccountType>, options: mongoose.QueryOptions<IAccountType>) {
    return await this.accountTypeRepository.findBy(query, options);
  }
}
