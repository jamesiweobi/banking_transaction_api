import { MongoUserRepository } from '../infrastructure/database/mongo.user.repo';
import { DuplicateResourceError } from '../errors/duplicateResource.error';
import dotenv from 'dotenv';
import { MongoBankRepository } from '../infrastructure/database/mongo.bank.repo';
import { MongoAccountRepository } from '../infrastructure/database/mongo.account.repo';
import { MongoAccountStatusHistoryRepository } from '../infrastructure/database/mongo.accountStatusHistory.repo';
import { MongoAccountTypeRepository } from '../infrastructure/database/mongo.accountType.repo';
import { MongoCurrencyRepository } from '../infrastructure/database/mongo.currency.repo';
import { AccountDto } from './dto/account.dto';
import { IUser } from './domain/user';
dotenv.config();

export class AccountService {
  constructor(
    private bankRepository: MongoBankRepository,
    // private userRepository: MongoUserRepository,
    private accountRepository: MongoAccountRepository,
    private accountStatusHistoryRepository: MongoAccountStatusHistoryRepository,
    private accountTypeRepository: MongoAccountTypeRepository,
    private currencyRepository: MongoCurrencyRepository,
  ) {}

  async createAccount(accountDto: AccountDto, user: IUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser({ name, email, password: hashedPassword });
    return { message: 'User registered successfully', user };
  }
}
