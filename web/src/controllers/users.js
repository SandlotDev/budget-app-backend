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
  const db = await connect();

  try {
    const { email, password } = req.body;

    const user = await db.query('users').findOne({ $eq: { email } });
    if (!user) {
      return res.status(status.unauthorized).json(http401Message());
    }

    const passwordMatch = await comparePassword(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(status.unauthorized).json(http401Message());
    }

    const token = await generateToken({ id: user.id }, user.email);
    return res.status(status.success).json(http200Response(token));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const signup = async (req, res) => {
  const db = await connect();

  try {
    const { name, email, password } = req.body;

    // validate input
    // validate input

    const exists = await db.query('users').findOne({ $eq: { email } });
    if (exists) {
      return res.status(status.bad).json(http400Message('account with this email already exists'));
    }

    const user = await db.query('users').insert({
      first_name: name.first.toLowerCase(),
      last_name: name.last.toLowerCase(),
      email: email.toLowerCase(),
      password_hash: await hashPassword(password),
    });

    console.log(user);
    const token = await generateToken({ id: user.id }, user.email);
    return res.status(status.created).json(http201Response(token));
  } catch (error) {
    console.log(error);
    return res.status(status.error).json(http500Message(error.message));
  } finally {
    db.release();
  }
};

module.exports = {
  signin,
  signup,
};
