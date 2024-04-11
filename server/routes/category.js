const router = require('express').Router();
const { isAuth, isAdmin, requiredLogin } = require('../controllers/auth');
const { create, categoryById, update, remove, list } = require('../controllers/category');
const { userById } = require('../controllers/user');

router.post('/category/create/:userId', isAdmin, create);

router.put('/category/:categoryId/:userId', update)
router.delete('/category/:categoryId/:userId', remove)

router.get('/categories', list)
router.param('userId', userById);
router.param('categoryId', categoryById);
module.exports = router;