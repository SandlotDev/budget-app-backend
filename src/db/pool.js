const { Pool } = require('pg');

const pool = new Pool();

pool.once('connect', () => {
  console.log('client connected');
});

pool.on('error', (err, client) => {
  console.log(err);
  client.release();
});

module.exports = pool;
