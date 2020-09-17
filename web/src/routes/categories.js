const router = require('express').Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
} = require('../controllers/categories');
const protectRoute = require('../middleware/protectRoute');

router.get('/categories', protectRoute, getCategories);
router.post('/categories', protectRoute, createCategory);
router.patch('/categories/:categoryId', protectRoute, updateCategory);
router.delete('/categories/:categoryId', protectRoute, deleteCategory);

module.exports = router;
