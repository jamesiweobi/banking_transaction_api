import mongoose from 'mongoose';
import AccountTypeModel from './schemas/accountType.schema';
import { IAccountType } from '../../application/domain/accountType';
import { IAccountTypeRepository } from '../../application/ports/accountType.interface.repo';

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
    const accountType = await AccountTypeModel.findOne({ id: new mongoose.Types.ObjectId(id) });
    return accountType ? (accountType.toObject() as unknown as IAccountType) : null;
  }
}
