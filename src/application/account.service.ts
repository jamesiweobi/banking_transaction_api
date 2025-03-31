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

export class AccountService {
  constructor(
    private accountRepository: MongoAccountRepository,
    private bankService: BankService,
    private currencyService: CurrencyService,
    private accountTypeService: AccountTypeService,
    private accountStatusHistoryService: AccountStatusHistoryService,
  ) {}

  async createAccount(accountDto: CreateAccountDto, user: IUser): Promise<{ account: IAccount }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const accountAndCurrencyComboExists = await this.accountRepository.findOne({
        bank: accountDto.bank,
        currency: accountDto.currency,
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
        accountType: accountDto.accountType,
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
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError('An error occurred while creating a new account');
    }
  }

  async commenceSeedingDatabase() {
    await Promise.all([
      this.bankService.seedBankCollections(),
      this.currencyService.seedCurrencyCollections(),
      this.accountTypeService.seedAccountTypeCollections(),
    ]);
  }

  private async _validateAccountDetails(accountDetails: CreateAccountDto) {
    try {
      await Promise.all([
        this.bankService.findById(accountDetails.bank.toString()),
        this.currencyService.findById(accountDetails.currency.toString()),
        this.accountTypeService.findById(accountDetails.accountType.toString()),
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
