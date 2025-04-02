import mongoose from 'mongoose';
import { MongoTransactionRepository } from '../infrastructure/database/mongo.transaction.repo';
import { CreateDepositTransactionDto, CreateTransactionDto, ITransaction } from './domain/transaction';
import { AppError } from '../errors/appError.error';
import { NotFoundError } from '../errors/notFound.error';
import { TransactionTypeEnum } from '../infrastructure/database/schemas/transactions.schema';
import { ILedgerEntry } from './domain/ledgerEntry';
import { IAccount } from './domain/account';
import { MongoAccountRepository } from '../infrastructure/database/mongo.account.repo';
import { MongoLedgerRepository } from '../infrastructure/database/mongo.ledgerEntry.repo';

export class TransactionService {
  constructor(
    private transactionRepository: MongoTransactionRepository,
    private accountRepository: MongoAccountRepository,
    private ledgerEntryRepository: MongoLedgerRepository,
  ) {}

  async createTransaction(data: CreateTransactionDto, session: mongoose.ClientSession): Promise<ITransaction> {
    const transaction = await this.transactionRepository.createTransaction({ ...data }, session);
    return transaction;
  }

  async handleDeposit(dto: CreateDepositTransactionDto) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const transactionPayload: CreateTransactionDto = {
        transactionType: TransactionTypeEnum.CREDIT,
        amount: dto.amount,
        account: new mongoose.Types.ObjectId(dto.account),
        accountOwner: new mongoose.Types.ObjectId(dto.accountOwner),
        currency: new mongoose.Types.ObjectId(dto.currency),
        description: dto.description,
        timestamp: new Date(),
      };
      const updatedAccount = await this.accountRepository.findByIdAndUpdate(
        dto.account.toString(),
        { $inc: { balance: dto.amount } },
        session,
      );

      if (!updatedAccount) {
        throw new NotFoundError('Account not found');
      }
      await this.createTransaction(transactionPayload, session);
      const ledgerEntryPayload: ILedgerEntry = {
        creditAccount: new mongoose.Types.ObjectId(dto.account),
        amount: dto.amount,
        balance: updatedAccount.balance,
        currency: new mongoose.Types.ObjectId(dto.currency),
        description: dto.description,
        timestamp: new Date(),
      };
      await this.ledgerEntryRepository.createLedgerEntry(ledgerEntryPayload, session);
      await session.commitTransaction();
      session.endSession();
      return { account: updatedAccount, ledgerEntryPayload: ledgerEntryPayload };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(error.message);
    }
  }

  async performWithdrawal(accountId: string, amount: number, description: string, session?: ClientSession) {
    if (!session) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    try {
      const account = await Account.findById(accountId).session(session);
      if (!account) {
        throw new BadRequestError('Account not found');
      }

      if (account.balance < amount) {
        throw new BadRequestError('Insufficient funds');
      }

      const transaction: ITransaction = {
        account: new Types.ObjectId(accountId),
        transactionType: TransactionTypeEnum.DEBIT,
        amount,
        currency: account.currency,
        description,
        timestamp: new Date(),
        ledger: new Types.ObjectId(), // You'll need to create a ledger entry
      };

      const createdTransaction = await Transaction.create([transaction], { session });

      const journalEntry: IJournalEntry = {
        debitAccountId: new Types.ObjectId(accountId),
        creditAccountId: new Types.ObjectId('cash_account_id'), // Replace with your cash account ID
        amount,
        currency: account.currency,
        description,
        timestamp: new Date(),
      };

      await JournalEntry.create([journalEntry], { session });

      await Account.findByIdAndUpdate(accountId, { $inc: { balance: -amount } }, { session });

      if (!session.inTransaction()) {
        await session.commitTransaction();
        session.endSession();
      }

      return createdTransaction[0];
    } catch (error: any) {
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      throw new AppError(error.message);
    }
  }
}
