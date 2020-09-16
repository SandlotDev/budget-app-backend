const connect = require('../db/connect');
const {
  status,
  http200Response,
  //   http201Response,
  //   http204Response,
  //   http400Message,
  //   http403Message,
  //   http404Message,
  http500Message,
} = require('../utils/status');

const getTransactions = async (req, res) => {
  const db = await connect();

  try {
    const { user_id: userId } = req.token;

    const transactions = await db.query('transactions').find({ $eq: { owner_id: userId } });
    return res.status(status.success).json(http200Response(transactions));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const getTransaction = async (req, res) => {
  const { transactionId } = req.params;
  res.send('single transaction');
};

const createTransaction = async (req, res) => {
  res.send('create transaction');
};

const updateTransaction = async (req, res) => {
  res.send('update transaction');
};

const deleteTransaction = async (req, res) => {
  res.send('delete transaction');
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
