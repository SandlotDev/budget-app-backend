const jwt = require('jsonwebtoken');

const { PRIVATE_KEY, PUBLIC_KEY } = require('./constants');

const tokenConfig = (subject) => ({
  algorithm: 'RS256',
  expiresIn: '24h',
  issuer: 'Budget App',
  audience: 'budget.app',
  subject,
});

const generateToken = (tokenize, subject) => new Promise((resolve, reject) => {
  jwt.sign(tokenize, PRIVATE_KEY, tokenConfig(subject), (err, token) => {
    if (err) reject(err);
    resolve(token);
  });
});

const verifyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, PUBLIC_KEY, (err, decoded) => {
    if (err) reject(err);
    resolve(decoded);
  });
});

module.exports = {
  generateToken,
  verifyToken,
};
