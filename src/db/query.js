const { Pool } = require('pg');

const pool = new Pool();

const query = async (text, params) => pool.query(text, params);

module.exports = query;
