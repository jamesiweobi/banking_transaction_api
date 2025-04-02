import { DuplicateResourceError } from '../errors/duplicateResource.error';
import { MongoAccountRepository } from '../infrastructure/database/mongo.account.repo';
import { MongoAccountStatusHistoryRepository } from '../infrastructure/database/mongo.accountStatusHistory.repo';
import { MongoAccountTypeRepository } from '../infrastructure/database/mongo.accountType.repo';
import { CreateAccountDto } from './dto/account.dto';
import { IUser } from './domain/user';
import { BankService } from './bank.service';
import { CurrencyService } from './currency.service';
import { AccountStatusHistoryService } from './accountStatusHistory.service';
import mongoose from 'mongoose';
import { IAccount } from './domain/account';
import { BadRequestError } from '../errors/badRequest.error';
import { AccountStatusEnum } from '../infrastructure/database/schemas/accountStatusHistory.schema';
import { AppError } from '../errors/appError.error';
import { AccountTypeService } from './accountType.sercive';
import { IBank } from './domain/bank';
import { ICurrency } from './domain/currency';
import { IAccountType } from './domain/accountType';
import { TransactionService } from './transaction.service';
import { TransactionTypeEnum } from '../infrastructure/database/schemas/transactions.schema';
import { CreateTransactionDto } from './domain/transaction';
import { NotFoundError } from '../errors/notFound.error';
import { ILedgerEntry } from './domain/ledgerEntry';

export class AccountService {
  constructor(
    private accountRepository: MongoAccountRepository,
    private bankService: BankService,
    private currencyService: CurrencyService,
    private accountTypeService: AccountTypeService,
    private accountStatusHistoryService: AccountStatusHistoryService,
    private transactionService: TransactionService,
  ) {}

  async createAccount(accountDto: CreateAccountDto, user: IUser): Promise<{ account: IAccount }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const accountAndCurrencyComboExists = await this.accountRepository.findOne({
        bank: accountDto.bank,
        currency: accountDto.currency,
        accountType: accountDto.accountType,
        accountOwner: user._id,
      });
      if (accountAndCurrencyComboExists) {
        throw new DuplicateResourceError('You already have an Account with the same number and currency.');
      }

      await this._validateAccountDetails(accountDto);

      const accountNumber = await this._generateAccountNumber();
      const newAccount: IAccount = {
        accountNumber,
        balance: 0,
        accountOwner: user,
        bank: new mongoose.Types.ObjectId(accountDto.bank),
        currency: new mongoose.Types.ObjectId(accountDto.currency),
        accountType: new mongoose.Types.ObjectId(accountDto.accountType),
        status: AccountStatusEnum.ACTIVE,
      };

      const createdAccount = await this.accountRepository.createAccount(newAccount, session);
      await this.accountStatusHistoryService.create(
        {
          status: AccountStatusEnum.ACTIVE,
          account: new mongoose.Types.ObjectId(createdAccount._id),
          accountOwner: new mongoose.Types.ObjectId(user._id),
        },
        session,
      );
      await session.commitTransaction();
      session.endSession();
      return { account: createdAccount };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(error.message);
    }
  }

  async commenceSeedingDatabase() {
    await Promise.all([
      this.bankService.seedBankCollections(),
      this.currencyService.seedCurrencyCollections(),
      this.accountTypeService.seedAccountTypeCollections(),
    ]);
  }

  async getCurrentUserAccounts(
    query: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 'asc' | 'desc'>;
    },
    user: IUser,
  ): Promise<{ data: IAccount[]; total: number }> {
    const filter: Partial<IAccount> = {
      accountOwner: new mongoose.Types.ObjectId(user._id),
    };

    const limit = query.limit || 10;
    const skip = query.skip || 0;
    const sort = query.sort ?? { createdAt: -1 };

    const result = await this.accountRepository.findBy(filter, { limit, skip, sort });
    return result;
  }

  async getBankList(query: {
    limit?: number;
    skip?: number;
    sort?: Record<string, 'asc' | 'desc'>;
  }): Promise<{ data: IBank[]; total: number }> {
    const filter: Partial<IBank> = {};

    const limit = query.limit || 10;
    const skip = query.skip || 0;
    const sort = query.sort ?? { createdAt: -1 };

    const result = await this.bankService.getBankList(filter, { limit, skip, sort });
    return result;
  }

  async getCurrencyList(query: {
    limit?: number;
    skip?: number;
    sort?: Record<string, 'asc' | 'desc'>;
  }): Promise<{ data: ICurrency[]; total: number }> {
    const filter: Partial<ICurrency> = {};

    const limit = query.limit || 10;
    const skip = query.skip || 0;
    const sort = query.sort ?? { createdAt: -1 };

    const result = await this.currencyService.getCurrencies(filter, { limit, skip, sort });
    return result;
  }

  async getAccountTypeList(query: {
    limit?: number;
    skip?: number;
    sort?: Record<string, 'asc' | 'desc'>;
  }): Promise<{ data: IAccountType[]; total: number }> {
    const filter: Partial<IAccountType> = {};

    const limit = query.limit || 10;
    const skip = query.skip || 0;
    const sort = query.sort ?? { createdAt: -1 };

    const result = await this.accountTypeService.getAccountTypeList(filter, { limit, skip, sort });
    return result;
  }

  private async _validateAccountDetails(accountDetails: CreateAccountDto) {
    try {
      await Promise.all([
        this.bankService.findById(accountDetails.bank),
        this.currencyService.findById(accountDetails.currency),
        this.accountTypeService.findById(accountDetails.accountType),
      ]);
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  private async _generateAccountNumber(length: number = 10): Promise<string> {
    const characters = '0123456789';
    let accountNumber = '';
    let accountNumberGenerated = false;
    while (!accountNumberGenerated) {
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        accountNumber += characters.charAt(randomIndex);
      }
      const existingAccount = await this.accountRepository.findOne({ accountNumber });
      if (!existingAccount) {
        accountNumberGenerated = true;
      }
    }
    return accountNumber;
  }
}
