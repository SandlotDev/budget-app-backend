const query = require('../db/query');

const queries = {
  getAll: 'SELECT * FROM accounts WHERE budget_id = $1',
  getOneById: 'SELECT * FROM accounts WHERE account_id = $1',
  create: 'INSERT INTO accounts (budget_id, account_name, account_balance, account_type) VALUES ($1, $2, $3, $4) RETURNING *',
};

const getAll = async (budgetId) => {
  const { rows } = await query(queries.getAll, [budgetId]);
  return rows;
};

const getOneById = async (accountId) => {
  const { rows } = await query(queries.getOneById, [accountId]);
  return rows[0] || false;
};

const create = async (budgetId, accountName, accountBalance, accountType) => {
  const { rows } = await query(queries.create, [
    budgetId, accountName, accountBalance, accountType,
  ]);
  return rows[0] || false;
};

module.exports = {
  getAll,
  getOneById,
  create,
};
