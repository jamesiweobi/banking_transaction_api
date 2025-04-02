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
    const currency = await CurrencyModel.findById(id);
    return currency ? (currency.toObject() as unknown as ICurrency) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<ICurrency>,
    options: mongoose.QueryOptions<ICurrency>,
  ): Promise<IFindQueryResponse<ICurrency>> {
    const { limit, sort, skip } = options;
    const [data, total] = await Promise.all([
      CurrencyModel.find(query).limit(limit!).skip(skip!).sort(sort!).exec(),
      CurrencyModel.countDocuments(query),
    ]);
    const page = Math.floor(skip! / limit!) + 1;
    const totalPages = Math.ceil(total / limit!);
    return {
      data: data.map((currency) => currency.toObject() as unknown as ICurrency),
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
