const connect = require('../db/connect');
const {
  status,
  http200Response,
  http201Response,
  http400Message,
  http403Message,
  http404Message,
  http500Message,
} = require('../utils/status');

const getAccounts = async (req, res) => {
  try {
    const db = await connect();

    const { user_id: userId } = req.token;
    const { budgetId } = req.query;

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.bad).json(http400Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const accounts = await db.query('accounts').find({ budget_id: budgetId });
    return res.status(status.success).json(http200Response(accounts));
  } catch (error) {
    console.error(error);
    return res.status(status.error).json(http500Message());
  }
};

const getAccount = async (req, res) => {
  try {
    const db = await connect();

    const { user_id: userId } = req.token;
    const { budgetId } = req.query;
    const { accountId } = req.params;

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.bad).json(http400Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const account = await db.query('accounts').findById(accountId);
    if (!account) {
      return res.status(status.notfound).json(http404Message());
    }

    return res.status(status.success).json(http200Response(account));
  } catch (error) {
    console.error(error);
    return res.json(http500Message());
  }
};

const createAccount = async (req, res) => {
  try {
    const db = await connect();

    const { user_id: userId } = req.token;
    const {
      budgetId, accountName, accountBalance, accountType,
    } = req.body;
    if (!budgetId || !accountName || !accountBalance || !accountType) {
      return res.status(status.error).json(http400Message());
    }

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.notfound).json(http404Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const account = await db.query('accounts').insert({
      budget_id: budgetId,
      account_name: accountName,
      account_balance: accountBalance,
      account_type: accountType,
    });

    return res.status(status.created).json(http201Response(account));
  } catch (error) {
    console.error(error);
    return res.status(status.error).json(http500Message());
  }
};

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
};
