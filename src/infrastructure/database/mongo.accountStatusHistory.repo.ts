import mongoose from 'mongoose';
import AccountStatusModel from './schemas/accountStatusHistory.schema';
import { CreateAccountHistory, IAccountStatusHistory } from '../../application/domain/accountStatusHistory';
import { IAccountStatusHistoryRepository } from '../../application/ports/accountStatus.interface.repo';
import { IFindQueryResponse } from '../../application/ports/types/findQuery.response';

export class MongoAccountStatusHistoryRepository implements IAccountStatusHistoryRepository {
  async createAccountStatus(
    AccountStatus: CreateAccountHistory,
    session?: mongoose.ClientSession,
  ): Promise<IAccountStatusHistory> {
    if (session) {
      const newAccountStatus = new AccountStatusModel(AccountStatus);
      const savedAccountStatus = await newAccountStatus.save({ session });
      const hydratedAccountStatus = savedAccountStatus.toObject() as unknown as IAccountStatusHistory;
      return hydratedAccountStatus;
    } else {
      const newAccountStatus = new AccountStatusModel(AccountStatus);
      const savedAccountStatus = await newAccountStatus.save({ session });
      const hydratedAccountStatus = savedAccountStatus.toObject() as unknown as IAccountStatusHistory;
      return hydratedAccountStatus;
    }
  }

  async findById(id: string): Promise<IAccountStatusHistory | null> {
    const accountStatus = await AccountStatusModel.findById(id);
    return accountStatus ? (accountStatus.toObject() as unknown as IAccountStatusHistory) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<IAccountStatusHistory>,
    options?: mongoose.QueryOptions<IAccountStatusHistory>,
  ): Promise<IFindQueryResponse<IAccountStatusHistory>> {
    const [data, total] = await Promise.all([
      AccountStatusModel.find(query, options ? options : { sort: { createdAt: -1 } })
        .populate('account')
        .populate('accountOwner')
        .exec(),
      AccountStatusModel.countDocuments(query),
    ]);
    return {
      data: data.map((account) => account.toObject() as unknown as IAccountStatusHistory),
      total,
    };
  }
}
