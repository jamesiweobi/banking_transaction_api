import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * @swagger
 * components:
 * schemas:
 * RegisterDto:
 * type: object
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * minLength: 6
 */
export class RegisterDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}

/**
 * @swagger
 * components:
 * schemas:
 * LoginDto:
 * type: object
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 */
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
