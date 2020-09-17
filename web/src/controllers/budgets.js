const connect = require('../db/connect');
const {
  status,
  http200Response,
  http201Response,
  http403Message,
  http404Message,
  http409Message,
  http500Message,
  http400Message,
  http204Response,
} = require('../utils/status');

const getBudgets = async (req, res) => {
  const db = await connect();

  try {
    const { id: ownerId } = req.token;
    const budgets = await db.query('budgets').find({ $eq: { owner_id: ownerId } });

    return res.status(status.success).json(http200Response(budgets));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const getBudget = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { budgetId } = req.params;

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.notfound).json(http404Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    // TESTING QUERY STRING CUSTOMIZED REQUESTS
    if (req.query.accounts) {
      budget.accounts = await db.query('accounts').find({ $eq: { budget_id: budgetId } });
    }
    // TESTING QUERY STRING CUSTOMIZED REQUESTS

    return res.status(status.success).json(http200Response(budget));
  } catch (error) {
    return res.status(500).json(http500Message());
  } finally {
    db.release();
  }
};

const createBudget = async (req, res) => {
  const db = await connect();

  try {
    const { id: ownerId } = req.token;
    const { budgetName } = req.body;

    // validate input
    if (!budgetName) {
      return res.status(status.bad).json(http400Message);
    }
    // validate input

    const exists = await db.query('budgets').findOne({ $eq: { owner_id: ownerId, budget_name: budgetName } });
    if (exists) {
      return res.status(status.conflict).json(http409Message());
    }

    const budget = await db.query('budgets').insert({ owner_id: ownerId, budget_name: budgetName });
    return res.status(status.created).json(http201Response(budget));
  } catch (error) {
    return res.status(500).json(http500Message());
  } finally {
    db.release();
  }
};

const updateBudget = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { budgetId } = req.params;
    const { budgetName } = req.body;

    // validate input
    // validate input

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.notfound).json(http404Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const updatedBudget = await db.query('budgets').updateById(budgetId, { budget_name: budgetName });
    return res.status(status.success).json(http200Response(updatedBudget));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const deleteBudget = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { budgetId } = req.params;

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.notfound).json(http404Message());
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    await db.query('budgets').deleteById(budgetId);
    return res.status(status.nocontent).json(http204Response());
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
};
