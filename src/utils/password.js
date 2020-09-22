const bcrypt = require('bcrypt');

const hashPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.hash(password, 8, (err, hash) => {
    if (err) reject(err);
    resolve(hash);
  });
});

const comparePassword = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
});

module.exports = {
  hashPassword,
  comparePassword,
};
