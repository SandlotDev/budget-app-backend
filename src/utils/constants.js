require('dotenv').config();
const assert = require('assert');
const fs = require('fs');

const privateKeyPath = './.config/jwtRS256.key';
const publicKeyPath = './.config/jwtRS256.key.pub';

assert(process.env.PGUSER, 'env PGUSER is required');
assert(process.env.PGHOST, 'env PGHOST is required');
assert(process.env.PGPASSWORD, 'env PGPASSWORD is required');
assert(process.env.PGDATABASE, 'env PGDATABASE is required');
assert(fs.existsSync(privateKeyPath), 'env PRIVATE_KEY is required - Try running "npm keys:generate"');
assert(fs.existsSync(publicKeyPath), 'env PUBLIC_KEY is required - Try running "npm keys:generate"');

const PORT = process.env.PORT || 3000;
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

module.exports = {
  PORT,
  PRIVATE_KEY,
  PUBLIC_KEY,
};
