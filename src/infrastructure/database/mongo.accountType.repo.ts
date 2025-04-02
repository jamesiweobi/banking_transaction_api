import mongoose from 'mongoose';
import AccountTypeModel from './schemas/accountType.schema';
import { IAccountType } from '../../application/domain/accountType';
import { IAccountTypeRepository } from '../../application/ports/accountType.interface.repo';
import { IFindQueryResponse } from '../../application/ports/types/findQuery.response';

export class MongoAccountTypeRepository implements IAccountTypeRepository {
  async createAccountType(AccountType: IAccountType): Promise<IAccountType> {
    const newAccountType = new AccountTypeModel(AccountType);
    const savedAccountType = await newAccountType.save();
    const hydratedAccountType = savedAccountType.toObject() as unknown as IAccountType;
    return hydratedAccountType;
  }

  async seedAccountTypeCollection(AccountTypes: IAccountType[]): Promise<void> {
    await AccountTypeModel.insertMany(AccountTypes);
  }

  async findById(id: string): Promise<IAccountType | null> {
    const accountType = await AccountTypeModel.findById(id);
    return accountType ? (accountType.toObject() as unknown as IAccountType) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<IAccountType>,
    options: mongoose.QueryOptions<IAccountType>,
  ): Promise<IFindQueryResponse<IAccountType>> {
    const { limit, sort, skip } = options;
    const [data, total] = await Promise.all([
      AccountTypeModel.find(query).limit(limit!).skip(skip!).sort(sort!).exec(),
      AccountTypeModel.countDocuments(query),
    ]);
    const page = Math.floor(skip! / limit!) + 1;
    const totalPages = Math.ceil(total / limit!);
    return {
      data: data.map((accountType) => accountType.toObject() as unknown as IAccountType),
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
