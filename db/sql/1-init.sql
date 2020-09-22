-- 
CREATE TABLE users (
    id SERIAL UNIQUE,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    PRIMARY KEY (email)
);
-- 
CREATE TABLE budgets (
    id SERIAL UNIQUE,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    budget_name VARCHAR NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    PRIMARY KEY (owner_id, budget_name)
);
-- 
-- CREATE TABLE roles (
--     role_id SERIAL UNIQUE,
--     role_name VARCHAR(30) NOT NULL,
--     PRIMARY KEY (role_id, role_name)
-- );
-- 
CREATE TABLE budget_users (
    budget_id INT REFERENCES budgets(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    -- role_id INT REFERENCES roles(role_id),
    PRIMARY KEY (budget_id, user_id)
);
-- 
CREATE TABLE account_types (
    id SERIAL UNIQUE,
    account_type_name VARCHAR(20) NOT NULL PRIMARY KEY
);
-- 
CREATE TABLE accounts (
    id SERIAL UNIQUE,
    budget_id INT REFERENCES budgets(id) ON DELETE CASCADE,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    account_name VARCHAR(30) NOT NULL,
    account_balance NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    account_type_id INT REFERENCES account_types(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    PRIMARY KEY (budget_id, owner_id, account_name)
);
-- 
CREATE TABLE categories (
    id SERIAL UNIQUE,
    budget_id INT REFERENCES budgets(id) ON DELETE CASCADE,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    category_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (budget_id, owner_id, category_name)
);
-- 
CREATE TABLE payees (
    id SERIAL UNIQUE,
    budget_id INT REFERENCES budgets(id) ON DELETE CASCADE,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    payee_name VARCHAR NOT NULL,
    PRIMARY KEY (budget_id, owner_id, payee_name)
);
-- 
CREATE TABLE transactions (
    id SERIAL UNIQUE PRIMARY KEY,
    account_id INT REFERENCES accounts(id) on DELETE CASCADE,
    budget_id INT REFERENCES budgets(id) ON DELETE CASCADE,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    transaction_category_id INT REFERENCES categories(id),
    transaction_payee_id INT REFERENCES payees(id),
    transaction_note TEXT
);