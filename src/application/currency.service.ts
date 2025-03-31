import { NotFoundError } from '../errors/notFound.error';
import { MongoCurrencyRepository } from '../infrastructure/database/mongo.currency.repo';
import { ICurrency } from './domain/currency';
import * as fs from 'fs';
import * as path from 'path';
import { AppError } from '../errors/appError.error';

export class CurrencyService {
  constructor(private currencyRepository: MongoCurrencyRepository) {}

  async findById(_id: string): Promise<ICurrency> {
    const currency = await this.currencyRepository.findById(_id);
    if (!currency) {
      throw new NotFoundError('Currency not found');
    }
    return currency;
  }

  async seedCurrencyCollections(): Promise<void> {
    const currenciesPath = path.resolve(__dirname, '../infrastructure/seed-data/currencies.json');
    const currenciesData = JSON.parse(fs.readFileSync(currenciesPath, 'utf8'));
    if (currenciesData.length > 0) {
      await this.currencyRepository.seedCurrencyCollection(currenciesData);
    } else {
      throw new AppError('No currencies found in the seed-data/currencies.json file');
    }
  }
}
