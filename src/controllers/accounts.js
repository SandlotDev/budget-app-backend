const connect = require('../db/connect');
const {
  status,
  http200Response,
  http201Response,
  http204Response,
  http400Message,
  http403Message,
  http404Message,
  http500Message,
} = require('../utils/status');

const getAccounts = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { budgetId } = req.query;

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.bad).json(http400Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const accounts = await db.query('accounts').find({ $eq: { budget_id: budgetId } });
    return res.status(status.success).json(http200Response(accounts));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const getAccount = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
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
    return res.json(http500Message());
  }
};

const createAccount = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const {
      budgetId, accountName, accountBalance, accountTypeId,
    } = req.body;

    // validate input
    if (!budgetId || !accountName || !accountBalance || !accountTypeId) {
      return res.status(status.error).json(http400Message());
    }
    // validate input

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.notfound).json(http404Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const account = await db.query('accounts').insert({
      budget_id: budgetId,
      owner_id: userId,
      account_name: accountName,
      account_balance: accountBalance,
      account_type_id: accountTypeId,
    });

    return res.status(status.created).json(http201Response(account));
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(status.bad).json(http400Message(`account with name '${req.body.accountName}' already exists`));
    }
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const updateAccount = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { accountId } = req.params;
    const {
      accountName, accountBalance,
    } = req.body;

    // validate input
    // validate input

    const exists = await db.query('accounts').findById(accountId);
    if (!exists) {
      return res.status(status.notfound).json(http404Message());
    }

    if (exists.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const updateData = {
      ...accountName && { account_name: accountName },
      ...accountBalance && { account_balance: accountBalance },
    };

    const account = await db.query('accounts').updateById(accountId, updateData);
    return res.status(status.success).json(http200Response(account));
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(status.bad).json(http400Message(`account with name '${req.body.accountName}' already exists`));
    }
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const deleteAccount = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { accountId } = req.params;

    const exists = await db.query('accounts').findById(accountId);
    if (!exists) {
      return res.status(status.notfound).json(http404Message());
    }

    if (exists.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    await db.query('accounts').deleteById(accountId);
    return res.status(status.nocontent).json(http204Response());
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
};
