import mongoose, { Types } from 'mongoose';
import { MongoTransactionRepository } from '../infrastructure/database/mongo.transaction.repo';
import {
  ICreateAccToAccTransferTransactionDto,
  ICreateDepositTransactionDto,
  CreateTransactionDto,
  ICreateWithDrawalTransactionDto,
  ITransaction,
} from './domain/transaction';
import { AppError } from '../errors/appError.error';
import { NotFoundError } from '../errors/notFound.error';
import { TransactionTypeEnum } from '../infrastructure/database/schemas/transactions.schema';
import { ILedgerEntry } from './domain/ledgerEntry';
import { MongoAccountRepository } from '../infrastructure/database/mongo.account.repo';
import { MongoLedgerRepository } from '../infrastructure/database/mongo.ledgerEntry.repo';
import { IUser } from './domain/user';
import { BadRequestError } from '../errors/badRequest.error';

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

  async handleDeposit(dto: ICreateDepositTransactionDto, user: IUser) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const account = await this.accountRepository.findOne({
        currency: dto.currency,
        accountOwner: user._id,
      });
      if (!account) {
        throw new NotFoundError(`Deposit Account with the specified currency not found.`);
      }

      const updatedAccount = await this.accountRepository.findByIdAndUpdate(
        account._id!.toString(),
        { $inc: { balance: dto.amount } },
        session,
      );

      if (!updatedAccount) {
        throw new NotFoundError('Account not found');
      }

      const ledgerEntryPayload: ILedgerEntry = {
        creditAccount: account._id!,
        amount: dto.amount,
        currency: new mongoose.Types.ObjectId(dto.currency),
      };
      const ledger = await this.ledgerEntryRepository.createLedgerEntry(ledgerEntryPayload, session);
      const transactionPayload: CreateTransactionDto = {
        transactionType: TransactionTypeEnum.CREDIT,
        amount: dto.amount,
        account: account._id!,
        balance: updatedAccount.balance,
        accountOwner: user._id!,
        currency: new mongoose.Types.ObjectId(dto.currency),
        description: `Deposit transaction to acc no:${account.accountNumber}: ${dto.description}`,
        timestamp: new Date(),
        ledgerEntry: ledger._id!,
      };
      const creditTransaction = await this.createTransaction(transactionPayload, session);
      await session.commitTransaction();
      await session.endSession();
      return { account: updatedAccount, ledgerEntryPayload: ledger, creditTransaction };
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(error.message);
    }
  }

  async performTransfer(dto: ICreateAccToAccTransferTransactionDto, user: IUser) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const creditAccount = await this.accountRepository.findById(dto.creditAccount.toString(), session);
      if (!creditAccount) {
        throw new BadRequestError('Credit Account not found');
      }
      const debitAccount = await this.accountRepository.findById(dto.debitAccount.toString(), session);
      if (!debitAccount) {
        throw new BadRequestError('Debit Account not found');
      }
      if (debitAccount.currency.toString() !== creditAccount.currency.toString()) {
        throw new BadRequestError('Invalid transaction: Currency mismatch.');
      }
      if (debitAccount.balance < dto.amount) {
        throw new BadRequestError('Insufficient funds in the sender account');
      }

      const ledgerEntryPayload: ILedgerEntry = {
        creditAccount: creditAccount._id!,
        debitAccount: debitAccount._id!,
        amount: dto.amount,
        currency: new mongoose.Types.ObjectId(dto.currency),
      };
      const ledger = await this.ledgerEntryRepository.createLedgerEntry(ledgerEntryPayload, session);
      const debitTransaction: CreateTransactionDto = {
        transactionType: TransactionTypeEnum.DEBIT,
        amount: dto.amount,
        currency: debitAccount.currency as Types.ObjectId,
        description: `Transfer to ${creditAccount.accountNumber}: ${dto.description}`,
        timestamp: new Date(),
        ledgerEntry: ledger._id!,
        account: debitAccount._id!,
        accountOwner: user._id!,
        balance: debitAccount.balance - dto.amount,
      };

      const creditTransaction: CreateTransactionDto = {
        transactionType: TransactionTypeEnum.CREDIT,
        amount: dto.amount,
        currency: debitAccount.currency as Types.ObjectId,
        description: `Transfer from ${debitAccount.accountNumber}: ${dto.description}`,
        timestamp: new Date(),
        ledgerEntry: ledger._id!,
        account: creditAccount._id!,
        accountOwner: creditAccount.accountOwner as mongoose.Types.ObjectId,
        balance: creditAccount.balance + dto.amount,
      };

      const completedCreditTransaction = await this.transactionRepository.createTransaction(creditTransaction, session);
      const completedDebitTransaction = await this.transactionRepository.createTransaction(debitTransaction, session);
      await this.accountRepository.findByIdAndUpdate(
        creditAccount._id!.toString(),
        { $inc: { balance: dto.amount } },
        session,
      );
      await this.accountRepository.findByIdAndUpdate(
        debitAccount._id!.toString(),
        { $inc: { balance: -dto.amount } },
        session,
      );

      await session.commitTransaction();
      await session.endSession();
      return {
        debitTransaction: completedDebitTransaction,
        creditTransaction: completedCreditTransaction,
        ledgerEntryPayload: ledgerEntryPayload,
      };
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(error.message);
    }
  }

  async performWithdrawal(dto: ICreateWithDrawalTransactionDto, user: IUser) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const debitAccount = await this.accountRepository.findOne(
        { currency: dto.currency, accountOwner: user._id },
        {},
        session,
      );

      if (!debitAccount) {
        throw new BadRequestError('Debit Account not found');
      }

      if (debitAccount.balance < dto.amount) {
        throw new BadRequestError('Insufficient funds in the debit account');
      }
      const debitLedger: ILedgerEntry = {
        debitAccount: debitAccount._id!,
        amount: dto.amount,
        currency: new mongoose.Types.ObjectId(dto.currency),
      };
      const ledger = await this.ledgerEntryRepository.createLedgerEntry(debitLedger, session);
      const transaction: CreateTransactionDto = {
        account: debitAccount._id!,
        transactionType: TransactionTypeEnum.DEBIT,
        amount: dto.amount,
        balance: debitAccount.balance - dto.amount,
        currency: dto.currency,
        description: `Withdrawal from ${debitAccount.accountNumber}: ${dto.description}`,
        timestamp: new Date(),
        ledgerEntry: ledger._id!,
        accountOwner: user._id!,
      };
      const amount = dto.amount;
      const updatedAccount = await this.accountRepository.findByIdAndUpdate(
        debitAccount._id!.toString(),
        { $inc: { balance: -amount } },
        session,
      );
      await this.transactionRepository.createTransaction(transaction, session);
      await session.commitTransaction();
      await session.endSession();
      return {
        transaction: transaction,
        ledgerEntryPayload: ledger,
        account: updatedAccount,
      };
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(error.message);
    }
  }
}
