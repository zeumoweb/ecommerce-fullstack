const Cart = require("../models/cart");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { request } = require("express");
const { log } = require("console");

exports.add = (req, res) => {
    const cart = Cart.findOne({ user: req.body.user }).exec((error, cart) => {
        if (error || !cart) {
            const newCart = new Cart(req.body);
            newCart.save((err, cart) => {
                if (err) return res.status(400).json({ error: errorHandler(err) });
                return res.status(200).json({ cart });
            });
            return;
        }

        for (const [key, value] of Object.entries(req.body.products)) {
            if (key in cart.products) {
                cart.products[key]['quantity'] = +cart.products[key]['quantity'] + +value['quantity'];
            } else {
                cart.products[key] = value;
            }
        }
        cart.markModified('products');
        cart.save((err, cart) => {
            if (err) return res.status(400).json({ error: errorHandler(err) });
            return res.status(200).json({ cart });
        });
    })
}

exports.remove_product = (req, res) => {
    Cart.findOne({ user: req.body.userId }, (error, cart) => {
        if (error || !cart) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        delete cart.products[req.body.productId];
        cart.markModified('products');
        cart.save((err, cart) => {
            if (err) return res.status(400).json({ error: errorHandler(err) });
            return res.status(200).json({ cart });
        });
    })
};

exports.delete_cart = (req, res) => {
    const user = req.body.user;
    Cart.deleteOne({ user }, (err) => {
        if (err) return res.status(400).json({ error: "Could not delete cart" });
        return res.status(200).json({ message: "Success" });
    })
};



exports.read = (req, res) => {
    Cart.findOne({ user: req.profile._id }, (error, cart) => {
        if (error) {
            return res.status(400).json({ error: "An Error Occured while reading the cart." });
        }
        if (!cart) {
            return res.status(400).json({ message: "No cart found" });
        }
        return res.status(200).json({ cart });
    })
};







