DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS payees;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS account_types;
DROP TABLE IF EXISTS budget_users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS budgets;
-- DROP TABLE domain_users;
-- DROP TABLE domains;
DROP TABLE IF EXISTS users;
CREATE TABLE Users (
    user_id SERIAL UNIQUE,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    PRIMARY KEY (email)
);
-- ADD SOME USERS
INSERT INTO users (first_name, last_name, email, password_hash)
VALUES ('Malik', 'Henry', 'malik@henry.com', '12345'),
    ('Noah', 'Hinds', 'noah@hinds.com', '12345'),
    (
        'Aurelia',
        'Merlin',
        'aurelia@merlin.com',
        '12345'
    ),
    ('Laila', 'Hinds', 'laila@hinds.com', '12345');
-- ADD SOME USERS
-- CREATE TABLE domains
-- (
--     domain_id SERIAL UNIQUE,
--     domain_name VARCHAR(50) NOT NULL,
--     owner_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     PRIMARY KEY (owner_id, domain_name)
-- );
-- -- ADD SOME DOMAINS
-- INSERT INTO domains
--     (domain_name, owner_id)
-- VALUES
--     ('Domain 1', 1),
--     ('Domain 1', 2),
--     ('Domain 2', 1),
--     ('Domain 2', 2);
-- ADD SOME DOMAINS
-- CREATE TABLE domain_users
-- (
--     domain_id INT REFERENCES domains(domain_id) ON DELETE CASCADE,
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     PRIMARY KEY (domain_id, user_id)
-- );
-- -- ADD A USER TO A DOMAIN
-- INSERT INTO domain_users
--     (domain_id, user_id)
-- VALUES
--     (2, 4);
-- ADD A USER TO A DOMAIN
CREATE TABLE budgets (
    budget_id SERIAL UNIQUE,
    -- domain_id INT REFERENCES domains(domain_id) ON DELETE CASCADE,
    owner_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    budget_name VARCHAR(30) NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    PRIMARY KEY (owner_id, budget_name)
);
-- ADD A BUDGET
INSERT INTO budgets (owner_id, budget_name)
VALUES (1, 'Budget 1'),
    (1, 'Budget 2');
-- ADD A BUDGET
-- CREATE TABLE roles (
--     role_id SERIAL UNIQUE,
--     role_name VARCHAR(30) NOT NULL,
--     PRIMARY KEY (role_id, role_name)
-- );
-- -- CREATE ROLES
-- INSERT INTO roles (role_name)
-- VALUES ('administrator'),
--     ('contributor'),
--     ('viewer');
-- --CREATE ROLES
CREATE TABLE budget_users (
    budget_id INT REFERENCES budgets(budget_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    -- role_id INT REFERENCES roles(role_id),
    PRIMARY KEY (budget_id, user_id)
);
-- SHARE A BUDGET WITH A USER
INSERT INTO budget_users (budget_id, user_id)
VALUES (2, 2);
-- SHARE A BUDGET WITH A USER
CREATE TABLE account_types (
    account_type_id SERIAL UNIQUE,
    account_type_name VARCHAR(20) NOT NULL,
    PRIMARY KEY (account_type_id, account_type_name)
);
-- CREATE ACCOUNT TYPES
INSERT INTO account_types (account_type_name)
VALUES ('Checking'),
    ('Savings'),
    ('Credit Card');
-- CREATE ACCOUNT TYPES
CREATE TABLE accounts (
    account_id SERIAL UNIQUE,
    budget_id INT REFERENCES budgets(budget_id) ON DELETE CASCADE,
    -- domain_id INT REFERENCES domains(domain_id) ON DELETE CASCADE,
    account_name VARCHAR(30) NOT NULL,
    account_balance NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    account_type INT REFERENCES account_types(account_type_id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    PRIMARY KEY (budget_id, account_name)
);
-- ADD AN ACCOUNT
INSERT INTO accounts (
        budget_id,
        account_name,
        account_balance,
        account_type
    )
VALUES (1, 'Bank of America', 20.16, 1),
    (1, 'Wells Fargo', 20.16, 2);
-- ADD AN ACCOUNT
CREATE TABLE categories (
    category_id SERIAL UNIQUE,
    budget_id INT REFERENCES budgets(budget_id) ON DELETE CASCADE,
    -- domain_id INT REFERENCES domains(domain_id) ON DELETE CASCADE,
    category_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (budget_id, category_name)
);
-- ADD SOME CATEGORIES
INSERT INTO categories (budget_id, category_name)
VALUES (1, 'Food'),
    (2, 'Rent');
-- ADD SOME CATEGORIES
CREATE TABLE payees (
    payee_id SERIAL UNIQUE,
    budget_id INT REFERENCES budgets(budget_id) ON DELETE CASCADE,
    -- domain_id INT REFERENCES domains(domain_id) ON DELETE CASCADE,
    payee_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (budget_id, payee_name)
);
CREATE TABLE transactions (
    transaction_id SERIAL UNIQUE PRIMARY KEY,
    account_id INT REFERENCES accounts(account_id) on DELETE CASCADE,
    budget_id INT REFERENCES budgets(budget_id) ON DELETE CASCADE,
    -- domain_id INT REFERENCES domains(domain_id) ON DELETE CASCADE,
    transaction_category INT REFERENCES categories(category_id),
    transaction_payee INT REFERENCES payees(payee_id),
    transaction_note TEXT
);
SELECT *
FROM users;
-- SELECT *
-- FROM domains;
-- SELECT *
-- FROM domain_users;
SELECT *
FROM budgets;
-- SELECT *
-- FROM roles;
SELECT *
FROM budget_users;
SELECT *
FROM accounts;
SELECT *
FROM account_types;
SELECT *
FROM categories;
SELECT *
FROM payees;
SELECT *
FROM transactions;
-- SELECT domainID, domainName, ownerID, firstName
-- FROM domains
--     LEFT OUTER JOIN users
--     ON domains.ownerid = users.userid
-- WHERE domains.ownerid = 3;
-- DELETE FROM users WHERE userid = 1;
SELECT budget_name,
    account_name,
    account_balance
FROM accounts
    INNER JOIN budgets ON accounts.budget_id = budgets.budget_id;
SELECT budget_name,
    category_name
FROM categories
    INNER JOIN budgets ON categories.budget_id = budgets.budget_id;