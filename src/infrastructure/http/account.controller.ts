import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../utils/http.responder';
import validateDto from '../../utils/dto.validator';
import { AccountService } from '../../application/account.service';
import { MongoAccountRepository } from '../database/mongo.account.repo';
import { BankService } from '../../application/bank.service';
import { CurrencyService } from '../../application/currency.service';
import { MongoAccountTypeRepository } from '../database/mongo.accountType.repo';
import { AccountStatusHistoryService } from '../../application/accountStatusHistory.service';
import { MongoBankRepository } from '../database/mongo.bank.repo';
import { MongoCurrencyRepository } from '../database/mongo.currency.repo';
import { MongoAccountStatusHistoryRepository } from '../database/mongo.accountStatusHistory.repo';
import { CreateAccountDto } from '../../application/dto/account.dto';
import { AccountTypeService } from '../../application/accountType.sercive';
import { AuthRequest } from '../../types/express';

const accountService = new AccountService(
  new MongoAccountRepository(),
  new BankService(new MongoBankRepository()),
  new CurrencyService(new MongoCurrencyRepository()),
  new AccountTypeService(new MongoAccountTypeRepository()),
  new AccountStatusHistoryService(new MongoAccountStatusHistoryRepository()),
);

export const createAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    validateDto(CreateAccountDto, req.body, next);
    const result = await accountService.createAccount(req.body, req.user!);
    sendResponse(res, 201, result);
  } catch (error) {
    next(error);
  }
};

export const seedAccountsRelatedData = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await accountService.commenceSeedingDatabase();
    sendResponse(res, 200, 'Accounts related data seeded successfully');
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserAccounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await accountService.getCurrentUserAccounts(req.query, req.user!);
    sendResponse(res, 200, result, 'User Accounts retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getBankList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await accountService.getBankList(req.query);
    sendResponse(res, 200, result, 'Bank list retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCurrencyList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await accountService.getCurrencyList(req.query);
    sendResponse(res, 200, result, 'Currency list retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAccountTypeList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await accountService.getAccountTypeList(req.query);
    sendResponse(res, 200, result, 'Account-Type list retrieved successfully');
  } catch (error) {
    next(error);
  }
};
