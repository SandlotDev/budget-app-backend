const fs = require('fs');
const jwt = require('jsonwebtoken');

const privateKEY = fs.readFileSync('./scripts/keys/jwtRS256.key', 'utf8');
const publicKEY = fs.readFileSync('./scripts/keys/jwtRS256.key.pub', 'utf8');

const tokenConfig = (subject) => ({
  algorithm: 'RS256',
  expiresIn: '24h',
  issuer: 'Budget App',
  audience: 'budget.app',
  subject,
});

const generateToken = (tokenize, subject) => new Promise((resolve, reject) => {
  jwt.sign(tokenize, privateKEY, tokenConfig(subject), (err, token) => {
    if (err) reject(err);
    resolve(token);
  });
});

const verifyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, publicKEY, (err, decoded) => {
    if (err) reject(err);
    resolve(decoded);
  });
});

module.exports = {
  generateToken,
  verifyToken,
};
