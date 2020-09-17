const router = require('express').Router();
const {
  getPayees, createPayee, updatePayee, deletePayee,
} = require('../controllers/payees');
const protectRoute = require('../middleware/protectRoute');

router.get('/payees', protectRoute, getPayees);
router.post('/payees', protectRoute, createPayee);
router.patch('/payees/:payeeId', protectRoute, updatePayee);
router.delete('/payees/:payeeId', protectRoute, deletePayee);

module.exports = router;
