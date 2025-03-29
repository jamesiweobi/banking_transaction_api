import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request } from 'express';
import { BadRequestError } from '../errors/badRequest.error';

async function validateDto<T extends object>(
  dtoClass: new () => T,
  reqBody: any,
  next: NextFunction,
): Promise<T | null> {
  const dto = plainToInstance(dtoClass, reqBody);
  const errors = await validate(dto);

  if (errors.length > 0) {
    const formattedErrors = errors.map((error) => ({
      field: error.property,
      message: Object.values(error.constraints || {}).join(', '),
    }));
    next(new BadRequestError('Validation failed', formattedErrors));
    return null;
  }
  return dto;
}

export default validateDto;
