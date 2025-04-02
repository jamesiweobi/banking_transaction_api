import { IsNotEmpty, IsNumber, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDepositTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsMongoId()
  currency: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateAccToAccTransferTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  creditAccount: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsMongoId()
  debitAccount: Types.ObjectId;
}

export class CreateWithdrawalTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsMongoId()
  currency: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  description: string;
}
