const router = require('express').Router();
const {
  getBudgets, getBudget, createBudget, updateBudget, deleteBudget,
} = require('../controllers/budgets');
const protectRoute = require('../middleware/protectRoute');

router.get('/budgets', protectRoute, getBudgets);
router.get('/budgets/:budgetId', protectRoute, getBudget);
router.post('/budgets', protectRoute, createBudget);
router.patch('/budgets/:budgetId', protectRoute, updateBudget);
router.delete('/budgets/:budgetId', protectRoute, deleteBudget);

module.exports = router;
