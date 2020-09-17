const { status, http404Message } = require('../utils/status');

const notFound = (req, res) => {
  res.status(status.notfound).json(http404Message());
};

module.exports = notFound;
