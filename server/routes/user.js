const express = require('express'); 

const { requiredLogin, isAdmin, isAuth, getToken } = require('../controllers/auth');
const router = express.Router();
const { userById, update, read, getAllUsers } = require('../controllers/user');

router.get('/user/:userId', update)

router.param('userId', userById); 
router.get('/allusers/:userId/:token', requiredLogin, isAdmin, getAllUsers)

router.param('token', getToken);
router.param('userId', userById);
module.exports = router