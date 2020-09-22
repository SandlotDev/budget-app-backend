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

const getPayees = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { budgetId } = req.query;

    const payees = await db.query('payees').find({
      $eq: {
        owner_id: userId,
        ...budgetId && { budget_id: budgetId },
      },
    });

    return res.status(status.success).json(http200Response(payees));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const createPayee = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const {
      budgetId, payeeName,
    } = req.body;

    // validate input
    if (!budgetId || !payeeName) {
      return res.status(status.error).json(http400Message());
    }
    // validate input

    const budget = await db.query('budgets').findById(budgetId);
    if (!budget) {
      return res.status(status.notfound).json(http404Message(`budget with Id ${budgetId} not found`));
    }

    if (budget.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const payee = await db.query('payees').insert({
      budget_id: budgetId,
      owner_id: userId,
      payee_name: payeeName,
    });

    return res.status(status.created).json(http201Response(payee));
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(status.bad).json(http400Message(`payee with name '${req.body.payeeName}' already exists`));
    }
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const updatePayee = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { payeeId } = req.params;
    const { payeeName } = req.body;

    // validate input
    if (!payeeName) {
      return res.status(status.error).json(http400Message());
    }
    // validate input

    const payee = await db.query('payees').findById(payeeId);
    if (!payee) {
      return res.status(status.notfound).json(http404Message(`payee with Id ${payeeId} not found`));
    }

    if (payee.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const updatedPayee = await db.query('payees').updateById(payeeId, {
      ...payeeName && { payee_name: payeeName },
    });

    return res.status(status.success).json(http200Response(updatedPayee));
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(status.bad).json(http400Message(`payee with name '${req.body.payeeName}' already exists`));
    }
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const deletePayee = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { payeeId } = req.params;

    const payee = await db.query('payees').findById(payeeId);
    if (!payee) {
      return res.status(status.notfound).json(http404Message(`payee with Id ${payeeId} not found`));
    }

    if (payee.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    await db.query('payees').deleteById(payeeId);

    return res.status(status.nocontent).json(http204Response());
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

module.exports = {
  getPayees,
  createPayee,
  updatePayee,
  deletePayee
};
