// const { Router } = require('express');
const express = require('express');
const router = express.Router();
const { signup, signin, signout, requiredLogin, getToken } = require('../controllers/auth');
const { check } = require('express-validator');

router.post(
    '/signup',
    check('email', 'email is required')
        .notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage('invalid email format')
        .isLength({
            min: 4,
            max: 32
        })
        .withMessage('email should be between 4 to 32 character'),
    check('password', 'password is required')
        .notEmpty()
        .isLength({
            min: 6
        })
        .withMessage('Password should be at least 6 characters')
        .matches(/\d/)
        .withMessage('Password should include a number'),
    check('name', 'name is required')
        .notEmpty()
        .withMessage('name should not be empty')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('name should only contain alphabets')
        .trim(),
    signup)

// signin route
router.post('/signin', signin)

// signout route 
router.get('/signout/:token', requiredLogin, signout)

// get token
router.param('token', getToken);

module.exports = router