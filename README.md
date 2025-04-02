# Senior Backend Engineer Test: Banking Transactions API (Ledger System)

## Overview

This project implements a banking ledger system that handles financial transactions with ACID compliance and double-entry accounting principles using MongoDB transactions. It adheres to a Hexagonal Architecture (Ports and Adapters), emphasizing a clear separation of concerns and testability.

## Core Requirements

### Account Management

* **User Accounts:** Basic account creation and management without complex verification processes.
* **Account Balances:** Tracks and manages account balances.
* **Multi-Currency Support:** Supports multiple currencies (NGN and USD).
* **Transaction History:** Maintains a comprehensive transaction history for each account.

### Transaction Operations

* **Deposits (CREDIT):** Handles credit transactions (deposits).
* **Withdrawals (DEBIT):** Processes debit transactions (withdrawals).
* **Account-to-Account Transfers:** Supports transfers between user accounts.
* **Double-Entry Accounting:** Ensures that every financial transaction has equal and opposite effects in at least two different accounts.

## Technical Requirements

* **Technologies:**
    * Node.js
    * Express.js
    * TypeScript
    * MongoDB
    * `class-validator` and `class-transformer` for DTO validation.
    * `jsonwebtoken` for token-based authentication.
    * `mongoose` for MongoDB interaction.
* **Architecture:** Hexagonal Architecture (Ports and Adapters)
* **ACID Compliance:** Uses MongoDB transactions to ensure data consistency and integrity.
* **Authentication:** Implements token-based authentication for secure access to endpoints.
* **Documentation:** Fully documents all endpoints using Postman.
* **Testing:** Writes unit tests for all functionalities.
* **Containerization (Optional):** Containerizes the API using Docker.

## Hexagonal Architecture Structure

The application follows a Hexagonal Architecture, which separates the core application logic (domain) from external dependencies (infrastructure).

* **Domain (Core):**
    * Contains business logic, entities, and interfaces (ports).
    * Independent of external frameworks and databases.
* **Application (Use Cases/Services):**
    * Contains the service layer, which orchestrates the domain logic, using the ports and adapters.
* **Ports (Interfaces):**
    * Defines the contracts between the domain and infrastructure.
* **Adapters (Infrastructure):**
    * Implements adapters that connect the domain to external systems (e.g., databases, APIs).
    * Adapters are interchangeable, allowing for easy testing and maintenance.

## Database Design

* **Accounts Collection:** Stores user account information, including account number, owner, balance, and currency.
* **Transactions Collection:** Stores transaction details, including transaction type, amount, currency, description, and related ledger entries.
* **Ledger Entries Collection:** Maintains detailed ledger entries for each transaction, ensuring double-entry accounting.
* **Users Collection:** Stores user information.
* **Currency Collection:** Stores currency information.
* **Banks Collection:** Stores bank information.
* **Account Types Collection:** Stores account type information.
* **Account Statuses Collection:** Stores account status information.
* **Account Status Histories Collection:** Stores account status history.

## Code Structure

* **`src/`:** Contains the application source code.
    * **`infrastructure/` (Adapters):** Implements adapters that connect the domain to external systems (e.g., databases, APIs).
        * **`database/` (Repositories):** Implements the persistence layer that interacts with MongoDB.
            * `schemas/` : Mongoose Schemas.
                * `account.schema.ts`
                * `accountStatusHistory.schema.ts`
                * `accountType.schema.ts`
                * `bank.schema.ts`
                * `currency.schema.ts`
                * `ledgerEntry.schema.ts`
                * `transactions.schema.ts`
                * `user.schema.ts`
            * `mongo.account.repo.ts`
            * `mongo.accountStatusHistory.repo.ts`
            * `mongo.accountType.repo.ts`
            * `mongo.bank.repo.ts`
            * `mongo.currency.repo.ts`
            * `mongo.ledgerEntry.repo.ts`
            * `mongo.transaction.repo.ts`
            * `mongo.user.repo.ts`
    * **`http/`:** HTTP related code.
    * **`seed-data/`:** Data seed files.
    * **`types/`:** Type definitions.
    * **`utils/`:** Utility functions.
    * **`app.ts`:** Main application file.
    * **.env:** Stores environment variables.
    * **package.json:** Lists project dependencies.
    * **tsconfig.json:** TypeScript configuration.
    * **Dockerfile:** Docker configuration (optional).

## Endpoints

### User Accounts

* **POST /users/register:** Registers a new user.
* **POST /auth/login:** Authenticates a user and returns a JWT token.
* **POST /accounts/create:** Creates a new account.
* **POST /accounts/seed-accounts-data:** Seeds account-related data.
* **GET /accounts/user:** Retrieves the current user's accounts.
* **GET /accounts/bank-list:** Retrieves the list of banks.
* **GET /accounts/currency-list:** Retrieves the list of currencies.
* **GET /accounts/account-type-list:** Retrieves the list of account types.

### Transactions

* **POST /transactions/deposit:** Creates a deposit transaction.
* **POST /transactions/withdrawal:** Creates a withdrawal transaction.
* **POST /transactions/transfer:** Creates an account-to-account transfer transaction.

## Error Handling

* Uses custom error classes (e.g., `NotFoundError`, `unAuthorized.error`).
* Returns appropriate HTTP status codes and error messages.
* Logs errors for debugging purposes.

## Security

* Implements token-based authentication using JWT.
* Validates and sanitizes input data using DTOs and `class-validator`.
* Stores sensitive data (e.g., JWT secret) in environment variables.

## Testing

* Writes unit tests for all service and repository methods.
* Uses a testing framework like Jest.

## Docker (Optional)

* Provides a `Dockerfile` for containerizing the application.
* Uses environment variables for configuration.
* Defines a Docker Compose file for running the application and MongoDB.

## Installation and Running Locally

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run the Application (Development Mode):**

    ```bash
    npm run dev
    ```

    This command will start the application in development mode using `ts-node-dev`, which provides automatic restarts upon file changes.

## Submission

* **GitHub Repository Link:** [Your GitHub Repository Link]
* **Live API Link:** [https://banking-transaction-api.onrender.com/api/v1/]
* **Postman Documentation Link:** [https://universal-crater-330946.postman.co/workspace/mainstack_backend_banking_api~debe7bd0-88ed-48ea-820f-7758c8ead524/collection/34845500-0e9fb0ab-0a34-4286-bb90-f0269b69a507?action=share&creator=34845500]