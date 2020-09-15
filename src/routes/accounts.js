const router = require('express').Router();
const { getAccounts, getAccount, createAccount } = require('../controllers/accounts');
const protectRoute = require('../middleware/protectRoute');

router.get('/accounts', protectRoute, getAccounts);
router.get('/accounts/:accountId', protectRoute, getAccount);
router.post('/accounts', protectRoute, createAccount);

module.exports = router;
