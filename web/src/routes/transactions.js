const router = require('express').Router();
const {
  getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction,
} = require('../controllers/transactions');
const protectRoute = require('../middleware/protectRoute');

router.get('/transactions', protectRoute, getTransactions);
router.get('/transactions/:transactionId', protectRoute, getTransaction);
router.post('/transactions', protectRoute, createTransaction);
router.patch('/transactions/:transactionId', protectRoute, updateTransaction);
router.delete('/transactions/:transactionId', protectRoute, deleteTransaction);

module.exports = router;
