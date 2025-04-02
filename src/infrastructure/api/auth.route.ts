import express from 'express';
import { login, register } from '../http/auth.controller';

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name:
 * type: string
 * description: User's name
 * email:
 * type: string
 * format: email
 * description: User's email address
 * password:
 * type: string
 * minLength: 6
 * description: User's password
 * responses:
 * 201:
 * description: User registered successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User registered successfully
 * user:
 * type: object
 * properties:
 * id:
 * type: string
 * description: User ID
 * name:
 * type: string
 * description: User's name
 * email:
 * type: string
 * description: User's email
 * 400:
 * description: Validation error
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Validation failed
 * errors:
 * type: array
 * items:
 * type: object
 * properties:
 * property:
 * type: string
 * example: email
 * constraints:
 * type: object
 * example: { isEmail: "email must be an email" }
 * 409:
 * description: Email address already in use
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Email address already in use.
 * 500:
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Login a user
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * description: User's email address
 * password:
 * type: string
 * minLength: 6
 * description: User's password
 * responses:
 * 200:
 * description: User logged in successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: JWT access token
 * _id:
 * type: string
 * description: User ID
 * 400:
 * description: Validation error
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Validation failed
 * errors:
 * type: array
 * items:
 * type: object
 * properties:
 * property:
 * type: string
 * example: email
 * constraints:
 * type: object
 * example: { isEmail: "email must be an email" }
 * 401:
 * description: Invalid credentials
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Invalid credentials
 * 500:
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Internal server error
 */
router.post('/login', login);

export default router;
