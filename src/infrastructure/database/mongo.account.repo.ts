import mongoose from 'mongoose';
import { IAccount } from '../../application/domain/account';
import { IAccountRepository } from '../../application/ports/account.interface.repo';
import AccountModel from './schemas/account.schema';
import { IFindQueryResponse } from '../../application/ports/types/findQuery.response';

export class MongoAccountRepository implements IAccountRepository {
  // async createAccount(Account: IAccount): Promise<IAccount> {
  //   const newAccount = new AccountModel(Account);
  //   const savedAccount = await newAccount.save();
  //   const hydratedAccount = savedAccount.toObject() as IAccount;
  //   return hydratedAccount;
  // }

  async createAccount(account: IAccount): Promise<IAccount> {
    const newAccount = new AccountModel(account);
    const savedAccount = await newAccount.save();
    const hydratedAccount = savedAccount.toObject() as unknown as IAccount;
    return hydratedAccount;
  }

  async seedAccountCollection(Accounts: IAccount[]): Promise<void> {
    await AccountModel.insertMany(Accounts);
  }

  async findById(id: string): Promise<IAccount | null> {
    const Account = await AccountModel.findOne({ id: new mongoose.Types.ObjectId(id) });
    return Account ? (Account.toObject() as unknown as IAccount) : null;
  }

  async findByName(AccountName: string): Promise<IAccount | null> {
    const account = await AccountModel.findOne({ AccountName });
    return account ? (account.toObject() as unknown as IAccount) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<IAccount>,
    options?: mongoose.QueryOptions<IAccount>,
  ): Promise<IFindQueryResponse<IAccount>> {
    const [data, total] = await Promise.all([
      AccountModel.find(query, options ? options : { sort: { createdAt: -1 } })
        .populate('currency')
        .populate('accountType')
        .populate('accountOwner')
        .exec(),
      AccountModel.countDocuments(query),
    ]);
    return {
      data: data.map((account) => account.toObject() as unknown as IAccount),
      total,
    };
  }

  async findOne(
    query: mongoose.FilterQuery<IAccount>,
    options?: mongoose.QueryOptions<IAccount>,
  ): Promise<IAccount | null> {
    const account = await AccountModel.find(query, options ? options : { sort: { createdAt: -1 } })
      .populate('currency')
      .populate('accountType')
      .populate('accountOwner')
      .exec();

    return account ? (account as unknown as IAccount) : null;
  }
}
