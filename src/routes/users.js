const router = require('express').Router();
const { signin, signup } = require('../controllers/users');

router.post('/users/signin', signin);
router.post('/users/signup', signup);

module.exports = router;
