const query = require('../db/query');

const queries = {
  getOneByEmail: 'SELECT * FROM users WHERE email = $1',
  create: 'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING user_id, first_name, last_name, email',
};

const getOneByEmail = async (email) => {
  const { rows } = await query(queries.getOneByEmail, [email]);
  return rows[0] || false;
};

const create = async (firstName, lastName, email, passwordHash) => {
  const { rows } = await query(queries.create, [
    firstName, lastName, email, passwordHash,
  ]);
  return rows[0] || false;
};

module.exports = {
  getOneByEmail,
  create,
};
