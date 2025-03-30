import mongoose from 'mongoose';
import CurrencyModel from './schemas/currency.schema';
import { IFindQueryResponse } from '../../application/ports/types/findQuery.response';
import { ICurrencyRepository } from '../../application/ports/currency.interface.repo';
import { ICurrency } from '../../application/domain/currency';

export class MongoCurrencyRepository implements ICurrencyRepository {
  async createCurrency(currency: ICurrency): Promise<ICurrency> {
    const newCurrency = new CurrencyModel(currency);
    const savedCurrency = await newCurrency.save();
    return savedCurrency.toObject() as unknown as ICurrency;
  }

  async seedCurrencyCollection(currencies: ICurrency[]): Promise<void> {
    await CurrencyModel.insertMany(currencies);
  }

  async findById(id: string): Promise<ICurrency | null> {
    const currency = await CurrencyModel.findOne({ id: new mongoose.Types.ObjectId(id) });
    return currency ? (currency.toObject() as unknown as ICurrency) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<ICurrency>,
    options?: mongoose.QueryOptions<ICurrency>,
  ): Promise<IFindQueryResponse<ICurrency>> {
    const [data, total] = await Promise.all([
      CurrencyModel.find(query, options ? options : { sort: { createdAt: -1 } }).exec(),
      CurrencyModel.countDocuments(query),
    ]);
    return {
      data: data.map((account) => account.toObject() as unknown as ICurrency),
      total,
    };
  }
}
