const User = require('../models/user');
const { validationResult } = require('express-validator');
const { errorHandler } = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');  // Generates signed token




// controller function associated with sign up
module.exports.signup = (req, res, next) => {
    // Extract errors gotten by express-validator generated during user signup 
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => { return msg }
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: result.mapped() })
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) return res.status(400).json({ err: errorHandler(err) });
        user.hashed_password = undefined;
        user.salt = undefined;
        res.status(200).json({
            user
        })
    })

}

// controller function associated with sign in

exports.signin = (req, res) => {
    const { email, password } = req.body;
    // Find user based on email
    const user = User.findOne({ email }, (error, user) => {
        if (error || !user) return res.status(400).json({
            error: "User with given email does not exist. Please sign up"
        })
        // Authenticate user by checking for password validity
        if (!user.authenticate(password, user.hashed_password)) {
            return res.status(401).json({ error: 'Email and password does not match. Please try again' })
        }
        // generate a signed token with _id and secret key
        let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1D' });
        // persist the token as t in the cookies
        res.cookie('token', token, { httpOnly: true });
        const { _id, email, role, name } = user;

        return res.status(200).json({ user: { _id, email, name, role }, token });
    })
}

// Sign out controller
exports.signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Signout successfully' })
}

// Check if user is signIn
exports.requiredLogin = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = user;
        if (req.auth) {
            next();
        } else {
            return res.status(403).json({ error: "Access Denied" })
        }
    } catch (err) {
        return res.status(401).json({ error: "You need to be signed in to access this route" })
    }
}

exports.getToken = (req, res, next, token) => {
    req.cookies.token = token;
    next();
}

// Authenticate a unique user
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();

}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        res.status(403).json({ error: "Admin Priviledges required!! Access denied" })
    }
    next()
} 