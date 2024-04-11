const Order = require("../models/order");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.add = (req, res, next) => {
    const newOrder = new Order(req.body);
    newOrder.save((err, order) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });
        next();
    });
}


exports.read = (req, res) => {
    Order.find()
        .populate('user')
        .exec((err, data) => {
            if (err || !data) return res.status(400).json({ error: "No Order not found" });
            return res.status(200).json({ data })
        })
};


exports.getOrderById = (req, res, next, id) => {
    req.body.orderId = id;
    next();
}

exports.readOneOrder = (req, res) => {
    Order.findOne({ _id: req.body.orderId })
        .populate('user')
        .exec((err, data) => {
            if (err || !data) return res.status(400).json({ error: "No Order not found" });
            return res.status(200).json({ data })
        })
};
