/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');
const fs = require('fs');
const stringify = require('csv-stringify');
const { hashPassword } = require('../utils/password');

const createUser = (pass, idx) => ({
  id: idx,
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: pass,
});

const createBudget = (ownerId, idx) => ({
  id: idx,
  owner_id: ownerId,
  budget_name: `Budget ${idx}`,
});

const createAccount = (budgetId, ownerId, idx) => ({
  id: idx,
  budget_id: budgetId,
  owner_id: ownerId,
  account_name: `${faker.finance.accountName()} - ${idx}`,
  account_balance: faker.finance.amount(),
  account_type_id: Math.floor(Math.random() * 3) + 1,
});

const createCategory = (budgetId, ownerId, idx) => ({
  id: idx,
  budget_id: budgetId,
  owner_id: ownerId,
  category_name: `${faker.commerce.department()} - ${idx}`,
});

const createPayee = (budgetId, ownerId, idx) => ({
  id: idx,
  budget_id: budgetId,
  owner_id: ownerId,
  payee_name: `${faker.company.companyName()} - ${idx}`,
});

const toCSV = (data, file) => {
  stringify(data, { header: true }, (err, output) => {
    fs.writeFile(`./scripts/dev/data/${file}.csv`, output, () => {});
  });
};

const users = [];
const budgets = [];
const accounts = [];
const categories = [];
const payees = [];

const seed = (numOfUsers) => {
  hashPassword('12345').then((passhash) => {
    const userCount = numOfUsers || 5;
    const budgetCount = 3;
    const accountCount = 8;
    const categoryCount = 15;
    const payeeCount = 15;

    let userId = 1;
    let budgetId = 1;
    let accountId = 1;
    let categoryId = 1;
    let payeeId = 1;

    for (let uIdx = 1; uIdx <= userCount; uIdx++) {
      const user = createUser(passhash, userId);
      users.push(user);
      userId += 1;
    }

    users.forEach((user) => {
      for (let bIdx = 1; bIdx <= budgetCount; bIdx++) {
        const budget = createBudget(user.id, budgetId);
        budgets.push(budget);
        budgetId += 1;
      }

      budgets.forEach((budget) => {
        for (let aIdx = 1; aIdx <= accountCount; aIdx++) {
          const account = createAccount(budget.id, user.id, accountId);
          accounts.push(account);
          accountId += 1;
        }

        for (let cIdx = 1; cIdx <= categoryCount; cIdx++) {
          const category = createCategory(budget.id, user.id, categoryId);
          categories.push(category);
          categoryId += 1;
        }

        for (let pIdx = 1; pIdx <= payeeCount; pIdx++) {
          const payee = createPayee(budget.id, user.id, payeeId);
          payees.push(payee);
          payeeId += 1;
        }
      });
    });

    users.forEach((user) => delete user.id);
    budgets.forEach((budget) => delete budget.id);
    accounts.forEach((account) => delete account.id);
    categories.forEach((category) => delete category.id);
    payees.forEach((payee) => delete payee.id);

    toCSV(users, 'users');
    toCSV(budgets, 'budgets');
    toCSV(accounts, 'accounts');
    toCSV(categories, 'categories');
    toCSV(payees, 'payees');
  });
};

seed(process.argv[2]);
