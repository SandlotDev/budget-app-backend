const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err, client) => {
  console.log(err);
  client.release();
});

module.exports = pool;
