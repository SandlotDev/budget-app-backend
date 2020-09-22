const router = require('express').Router();
const {
  getAccounts, getAccount, createAccount, updateAccount, deleteAccount,
} = require('../controllers/accounts');
const protectRoute = require('../middleware/protectRoute');

router.get('/accounts', protectRoute, getAccounts);
router.get('/accounts/:accountId', protectRoute, getAccount);
router.post('/accounts', protectRoute, createAccount);
router.patch('/accounts/:accountId', protectRoute, updateAccount);
router.delete('/accounts/:accountId', protectRoute, deleteAccount);

module.exports = router;
