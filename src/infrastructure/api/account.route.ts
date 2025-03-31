import express from 'express';
import { createAccount, seedAccountsRelatedData } from '../http/account.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /accounts:
 * post:
 * summary: Create a new account
 * tags: [Accounts]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CreateAccountDto'
 * responses:
 * 201:
 * description: Account created successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AccountDto'
 * 400:
 * description: Validation error
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ValidationError'
 * 500:
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ServerError'
 * get:
 * summary: Get a list of accounts
 * tags: [Accounts]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: accountNumber
 * schema:
 * type: string
 * description: Filter by account number
 * - in: query
 * name: balance
 * schema:
 * type: number
 * description: Filter by account balance
 * - in: query
 * name: user
 * schema:
 * type: string
 * description: Filter by user ID
 * - in: query
 * name: currency
 * schema:
 * type: string
 * description: Filter by currency ID
 * - in: query
 * name: accountType
 * schema:
 * type: string
 * description: Filter by account type ID
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * description: Limit the number of results
 * - in: query
 * name: skip
 * schema:
 * type: integer
 * description: Skip a number of results
 * - in: query
 * name: sort
 * schema:
 * type: object
 * description: Sort the results
 * example: { accountNumber: 'asc' }
 * responses:
 * 200:
 * description: List of accounts
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/AccountDto'
 * total:
 * type: number
 * 500:
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ServerError'
 * /accounts/{id}:
 * get:
 * summary: Get an account by ID
 * tags: [Accounts]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Account ID
 * responses:
 * 200:
 * description: Account details
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AccountDto'
 * 404:
 * description: Account not found
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/NotFoundError'
 * 500:
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ServerError'
 * put:
 * summary: Update an account by ID
 * tags: [Accounts]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Account ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UpdateAccountDto'
 * responses:
 * 200:
 * description: Account updated successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AccountDto'
 * 400:
 * description: Validation error
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ValidationError'
 * 404:
 * description: Account not found
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/NotFoundError'
 * 500:
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ServerError'
 * delete:
 * summary: Delete an account by ID
 * tags: [Accounts]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Account ID
 * responses:
 * 204:
 * description: Account deleted successfully
 * 404:
 * description: Account not found
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/NotFoundError'
 * 500:
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ServerError'
 */

router.post('/create', authMiddleware, createAccount);
router.post('/seed-accounts-data', authMiddleware, seedAccountsRelatedData);
// router.get('/', authenticate, getAccounts);
// router.get('/:id', authenticate, getAccountById);
// router.put('/:id', authenticate, updateAccount);
// router.delete('/:id', authenticate, deleteAccount);

export default router;
