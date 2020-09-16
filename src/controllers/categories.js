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

const getCategories = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { budgetId } = req.query;

    const categories = await db.query('categories').find({
      $eq: {
        owner_id: userId,
        ...budgetId && { budget_id: budgetId },
      },
    });

    return res.status(status.success).json(http200Response(categories));
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const createCategory = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const {
      budgetId, categoryName,
    } = req.body;

    // validate input
    if (!budgetId || !categoryName) {
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

    const category = await db.query('categories').insert({
      budget_id: budgetId,
      owner_id: userId,
      category_name: categoryName,
    });

    return res.status(status.created).json(http201Response(category));
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(status.bad).json(http400Message(`category with name '${req.body.categoryName}' already exists`));
    }
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const updateCategory = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    // validate input
    // if (!budgetId || !categoryName) {
    //   return res.status(status.error).json(http400Message());
    // }
    // validate input

    const category = await db.query('categories').findById(categoryId);
    if (!category) {
      return res.status(status.notfound).json(http404Message(`category with Id ${categoryId} not found`));
    }

    if (category.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    const updatedCategory = await db.query('categories').updateById(categoryId, {
      ...categoryName && { category_name: categoryName },
    });

    return res.status(status.success).json(http200Response(updatedCategory));
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(status.bad).json(http400Message(`category with name '${req.body.categoryName}' already exists`));
    }
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

const deleteCategory = async (req, res) => {
  const db = await connect();

  try {
    const { id: userId } = req.token;
    const { categoryId } = req.params;

    const category = await db.query('categories').findById(categoryId);
    if (!category) {
      return res.status(status.notfound).json(http404Message(`category with Id ${categoryId} not found`));
    }

    if (category.owner_id !== userId) {
      return res.status(status.forbidden).json(http403Message());
    }

    await db.query('categories').deleteById(categoryId);

    return res.status(status.nocontent).json(http204Response());
  } catch (error) {
    return res.status(status.error).json(http500Message());
  } finally {
    db.release();
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
