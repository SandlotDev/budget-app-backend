const { JsonWebTokenError, TokenExpiredError } = require('../utils/errors');
const { status, http401Message, http500Message } = require('../utils/status');
const { verifyToken } = require('../utils/token');

const protectRoute = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(status.unauthorized).json(http401Message());
    }

    const token = authorization.split(' ')[1];
    req.token = await verifyToken(token);
    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
      return res.status(status.unauthorized).json(http401Message(error.message));
    }
    return res.status(500).json(http500Message());
  }
};

module.exports = protectRoute;
