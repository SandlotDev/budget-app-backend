-- ADD SOME USERS
-- INSERT INTO users (first_name, last_name, email, password_hash)
-- VALUES ('Malik', 'Henry', 'malik@henry.com', '12345'),
--     ('Noah', 'Hinds', 'noah@hinds.com', '12345'),
--     (
--         'Aurelia',
--         'Merlin',
--         'aurelia@merlin.com',
--         '12345'
--     ),
--     ('Laila', 'Hinds', 'laila@hinds.com', '12345');
-- ADD SOME USERS
-- 
-- ADD A BUDGET
-- INSERT INTO budgets (owner_id, budget_name)
-- VALUES (1, 'Budget 1'),
--     (1, 'Budget 2');
-- ADD A BUDGET
-- 
-- -- CREATE ROLES
-- INSERT INTO roles (role_name)
-- VALUES ('administrator'),
--     ('contributor'),
--     ('viewer');
-- --CREATE ROLES
-- 
-- SHARE A BUDGET WITH A USER
-- INSERT INTO budget_users (budget_id, user_id)
-- VALUES (2, 2);
-- SHARE A BUDGET WITH A USER
--
-- CREATE ACCOUNT TYPES
INSERT INTO account_types (account_type_name)
VALUES ('Checking'),
    ('Savings'),
    ('Credit Card');
-- CREATE ACCOUNT TYPES
-- 
-- ADD AN ACCOUNT
-- INSERT INTO accounts (
--         budget_id,
--         account_name,
--         account_balance,
--         account_type
--     )
-- VALUES (1, 'Bank of America', 20.16, 1),
--     (1, 'Wells Fargo', 20.16, 2);
-- ADD AN ACCOUNT
-- ADD SOME CATEGORIES
-- INSERT INTO categories (budget_id, category_name)
-- VALUES (1, 'Food'),
--     (2, 'Rent');
-- ADD SOME CATEGORIES
-- ADD SOME PAYEES
-- INSERT INTO payees (budget_id, payee_name)
-- VALUES (1, 'Mcdonalds'),
--     (1, 'Target')
-- ADD SOME PAYEES
COPY users (
    first_name,
    last_name,
    email,
    password_hash
)
FROM '/docker-entrypoint-initdb.d/data/users.csv' DELIMITER ',' CSV HEADER;
-- 
COPY budgets (owner_id, budget_name)
FROM '/docker-entrypoint-initdb.d/data/budgets.csv' DELIMITER ',' CSV HEADER;
-- 
COPY accounts (
    budget_id,
    owner_id,
    account_name,
    account_balance,
    account_type_id
)
FROM '/docker-entrypoint-initdb.d/data/accounts.csv' DELIMITER ',' CSV HEADER;
-- 
COPY categories (budget_id, owner_id, category_name)
FROM '/docker-entrypoint-initdb.d/data/categories.csv' DELIMITER ',' CSV HEADER;
-- 
COPY payees (budget_id, owner_id, payee_name)
FROM '/docker-entrypoint-initdb.d/data/payees.csv' DELIMITER ',' CSV HEADER;