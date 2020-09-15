const query = require('../db/query');

const queries = {
  getAll: 'SELECT * FROM budgets WHERE owner_id = $1',
  getOneById: 'SELECT * FROM budgets WHERE budget_id = $1',
  getOneByNameAndOwner: 'SELECT * FROM budgets WHERE owner_id = $1 AND budget_name = $2',
  create: 'INSERT INTO budgets (owner_id, budget_name) VALUES ($1, $2) RETURNING *',
  updateById: 'UPDATE budgets SET budget_name =$1 WHERE budget_id = $2 RETURNING *',
  deleteById: 'DELETE FROM budgets WHERE budget_id = $1',
};

const getAll = async (ownerId) => {
  const { rows } = await query(queries.getAll, [ownerId]);
  return rows;
};

const getOneById = async (budgetId) => {
  const { rows } = await query(queries.getOneById, [budgetId]);
  return rows[0] || false;
};

const getOneByNameAndOwner = async (ownerId, budgetName) => {
  const { rows } = await query(queries.getOneByNameAndOwner, [ownerId, budgetName]);
  return rows[0] || false;
};

const create = async (ownerId, budgetName) => {
  const { rows } = await query(queries.create, [ownerId, budgetName]);
  return rows[0] || false;
};

const updateById = async (budgetName, budgetId) => {
  const { rows } = await query(queries.updateById, [budgetName, budgetId]);
  return rows[0] || false;
};

const deleteById = async (budgetId) => query(queries.deleteById, [budgetId]);

module.exports = {
  getAll,
  getOneById,
  getOneByNameAndOwner,
  create,
  updateById,
  deleteById,
};
