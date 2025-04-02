import express from 'express';
import {
  handleBankTransferRequest,
  handleDpositRequest,
  handleWithdrawalRequest,
} from '../http/transactions.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = express.Router();

router.post('/deposit', authMiddleware, handleDpositRequest);
router.post('/withdrawal', authMiddleware, handleWithdrawalRequest);
router.post('/transfer', authMiddleware, handleBankTransferRequest);

export default router;
