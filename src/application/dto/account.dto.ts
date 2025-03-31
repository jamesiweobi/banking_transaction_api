import { IsString, IsNumber, IsMongoId, IsOptional, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 * schemas:
 * AccountDto:
 * type: object
 * properties:
 * accountNumber:
 * type: string
 * description: The account number.
 * balance:
 * type: number
 * description: The account balance.
 * user:
 * type: string
 * description: The user associated with the account.
 * currency:
 * type: string
 * description: The currency of the account.
 * accountType:
 * type: string
 * description: The type of the account.
 * createdAt:
 * type: string
 * format: date-time
 * description: The creation date of the account.
 * updatedAt:
 * type: string
 * format: date-time
 * description: The last update date of the account.
 * CreateAccountDto:
 * type: object
 * required:
 * - accountNumber
 * - balance
 * - user
 * - currency
 * - accountType
 * properties:
 * accountNumber:
 * type: string
 * description: The account number.
 * balance:
 * type: number
 * description: The account balance.
 * user:
 * type: string
 * description: The user associated with the account.
 * currency:
 * type: string
 * description: The currency of the account.
 * accountType:
 * type: string
 * description: The type of the account.
 * UpdateAccountDto:
 * type: object
 * properties:
 * accountNumber:
 * type: string
 * description: The account number.
 * balance:
 * type: number
 * description: The account balance.
 * user:
 * type: string
 * description: The user associated with the account.
 * currency:
 * type: string
 * description: The currency of the account.
 * accountType:
 * type: string
 * description: The type of the account.
 * AccountQueryDto:
 * type: object
 * properties:
 * accountNumber:
 * type: string
 * description: The account number.
 * balance:
 * type: number
 * description: The account balance.
 * user:
 * type: string
 * description: The user associated with the account.
 * currency:
 * type: string
 * description: The currency of the account.
 * accountType:
 * type: string
 * description: The type of the account.
 * limit:
 * type: number
 * description: The number of results to limit.
 * skip:
 * type: number
 * description: The number of results to skip.
 * sort:
 * type: object
 * description: The sort order.
 * example: { accountNumber: 'asc' }
 */

export class CreateAccountDto {
  @IsNotEmpty()
  @IsMongoId()
  currency!: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  bank!: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  accountType!: mongoose.Types.ObjectId;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsMongoId()
  user?: mongoose.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  currency?: mongoose.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  accountType?: mongoose.Types.ObjectId;
}

export class AccountQueryDto {
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsMongoId()
  user?: mongoose.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  currency?: mongoose.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  accountType?: mongoose.Types.ObjectId;

  @IsOptional()
  limit?: number;

  @IsOptional()
  skip?: number;

  @IsOptional()
  sort?: { [key: string]: 'asc' | 'desc' };
}
