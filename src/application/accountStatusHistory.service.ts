import mongoose from 'mongoose';
import { MongoAccountStatusHistoryRepository } from '../infrastructure/database/mongo.accountStatusHistory.repo';
import { CreateAccountHistory, IAccountStatusHistory } from './domain/accountStatusHistory';

export class AccountStatusHistoryService {
  constructor(private accountStatusHistoryRepository: MongoAccountStatusHistoryRepository) {}

  async create(data: CreateAccountHistory, session?: mongoose.ClientSession): Promise<IAccountStatusHistory> {
    const accountStatus = await this.accountStatusHistoryRepository.createAccountStatus(
      {
        ...data,
      },
      session,
    );
    return accountStatus;
  }
}
