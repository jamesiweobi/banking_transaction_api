import { TransactionService } from '../../application/transaction.service';
import { MongoAccountRepository } from '../database/mongo.account.repo';
import { MongoLedgerRepository } from '../database/mongo.ledgerEntry.repo';
import { MongoTransactionRepository } from '../database/mongo.transaction.repo';
import { AuthRequest } from '../../types/express';
import validateDto from '../../utils/dto.validator';
import sendResponse from '../../utils/http.responder';
import {
  CreateAccToAccTransferTransactionDto,
  CreateDepositTransactionDto,
  CreateWithdrawalTransactionDto,
} from '../../application/dto/transaction.dto';
import { NextFunction, Response } from 'express';
import { _performTransactionWithRetry } from '../../utils/transaction.retry.handler.util';

const transactionService = new TransactionService(
  new MongoTransactionRepository(),
  new MongoAccountRepository(),
  new MongoLedgerRepository(),
);

export const handleDpositRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    validateDto(CreateDepositTransactionDto, req.body, next);
    const result = await _performTransactionWithRetry(() => transactionService.handleDeposit(req.body, req.user!));
    sendResponse(res, 200, result, 'Transaction successfully');
  } catch (error) {
    next(error);
  }
};

export const handleWithdrawalRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    validateDto(CreateWithdrawalTransactionDto, req.body, next);
    const result = await _performTransactionWithRetry(() => transactionService.performWithdrawal(req.body, req.user!));
    sendResponse(res, 200, result, 'Transaction successfully');
  } catch (error) {
    next(error);
  }
};

export const handleBankTransferRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    validateDto(CreateAccToAccTransferTransactionDto, req.body, next);
    const result = await _performTransactionWithRetry(() => transactionService.performTransfer(req.body, req.user!));
    sendResponse(res, 200, result, 'Transaction successfully');
  } catch (error) {
    next(error);
  }
};
