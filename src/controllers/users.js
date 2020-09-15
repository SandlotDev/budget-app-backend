// const { getOneByEmail, create } = require('../services/users');
const connect = require('../db/connect');
const {
  status,
  http200Response,
  http201Response,
  http500Message,
  http400Message,
  http401Message,
} = require('../utils/status');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/token');

const signin = async (req, res) => {
  try {
    const db = await connect();

    const { email, password } = req.body;

    const user = await db.query('users').findOne({ email });
    if (!user) {
      return res.status(status.unauthorized).json(http401Message());
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    delete user.password_hash;

    if (!passwordMatch) {
      return res.status(status.unauthorized).json(http401Message());
    }

    const token = await generateToken(user, user.email);
    return res.status(status.success).json(http200Response(token));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  }
};

const signup = async (req, res) => {
  try {
    const db = await connect();
    const { name, email, password } = req.body;

    // const exists = await getOneByEmail(email);
    const exists = await db.query('users').findOne({ email });
    if (exists) {
      return res.status(status.bad).json(http400Message());
    }

    const user = await db.query('users').insert({
      first_name: name.first.toLowerCase(),
      last_name: name.last.toLowerCase(),
      email: email.toLowerCase(),
      password_hash: await hashPassword(password),
    });

    const token = await generateToken(user, user.email);
    return res.status(status.created).json(http201Response(token));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  }
};

module.exports = {
  signin,
  signup,
};
