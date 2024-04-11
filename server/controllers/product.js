const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { request } = require("express");
const { OpenAI } = require('openai');


const openai = new OpenAI();

exports.chat = async (req, res) => {
    const prompt = req.body.prompt;
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": "You are a helpful assistant. Your Name is Mike. Answer all the questios asked to you as Mike. Assume that you are a shopping assistance, and don't make the user suspect that you are chat gpt. All the answers that you give should be a json with two key in the form, {\"message\": [specify your answer to the user], \"productIds\":[lookup the product id in the data provided and pass it here]} the first key should be your normal answer as an assistant, and the second key should be a list of product ids. The second key should be an empty list if it does not apply to the users request. This should be in a format that is easily parse to a json object using JSON.parse." },
            {
                "role": "user",
                "content": "Hello Mike! Can you tell me about our products?"
            },
            {
                "role": "assistant", "content": "this is a json object that contains the details of all the products in our database. Use that as a reference to answer the user's question." + JSON.stringify(req.body.products)
            },
            {
                "role": "assistant",
                "content": "Sure, I have access to information about all the products in our database. Let me fetch the details for you."
            },
            {
                "role": "user",
                "content": "I'm interested in knowing about the products in store."
            },
            {
                "role": "assistant",
                "content": "Amazing, we have many categories of products in our store. We have electronics, clothing, and many more. What category are you interested in?"
            },

            { "role": "user", "content": prompt },],
        model: "gpt-3.5-turbo",
    });

    return res.status(200).json({ data: completion.choices[0].message.content });

}

exports.listAllProducts = (req, res, next) => {
    Product
        .find()
        .select("-photo")
        .populate('category')
        .exec((err, data) => {
            if (err || !data) return res.status(400).json({ error: "No products found" });
            req.body.products = data;
            next();
        })
}


exports.create = (req, res) => {

    if ( req.body.shipping && req.body.shipping === "true") {
        req.body.shipping = true;
    } else {
        req.body.shipping = false;
    }

    console.log(req.body)
    const { name, shipping, price, description, quantity, category } = req.body;
    if (
        !name ||
        !price ||
        !category ||
        !description ||
        !quantity
    ) {
        return res.status(400).json({ error: "All products fields are required" });
    }
    const product = new Product(req.body);
    console.log(req.file, "FILLLLLLe")
    product.photo.data = fs.readFileSync("./uploads/" + req.file.filename)
    product.photo.contentType = req.file.mimetype
    product.save((err, product) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });
        res.status(200).json({ "message": "Product successfully created"});
    });
}

exports.productById = (req, res, next, id) => {
    Product.findOne({ _id: id }).exec((err, product) => {
        if (err || !product)
            return res.status(400).json({ error: "No product found" });
        req.product = product;
        next();
    });
};

exports.remove = (req, res) => {
    const id = req.product._id;
    Product.deleteOne({ _id: id }, (err) => {
        if (err) return res.status(400).json({ error: "Could not delete product" });
        return res.status(200).json({ message: "Product succesfully deleted" });
    })
}


exports.update = (req, res) => {
    if (req.body.shipping === "true") {
        req.body.shipping = true;
    }

    const { name, shipping, price, description, quantity, category } = req.body;
    if (
        !name ||
        !shipping ||
        !price ||
        !category ||
        !description ||
        !quantity
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }
    let product = req.product;
    product = _.extend(product, req.body);
    product.photo.data = fs.readFileSync("uploads/" + req.file.filename)
    product.photo.contentType = req.file.mimetype

    product.save((err, product) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });
        res.status(200).json({ product, message: "Successfully updated" });
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    res.json(req.product);
}

/** It will find and display the products based on the query Parameters
and will display all product if no query parameter is available*/
exports.list = (req, res) => {
    const sortBy = req.query.sortby ? req.query.sortBy : "_id";
    const order = req.query.order ? req.query.order : "asc";
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    Product
        .find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err || !data) return res.status(400).json({ error: "Product not found" });
            return res.status(200).json({ data });
        })
}

/** it will find and display the products related to the current product based on the current req product category */

exports.listRelated = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    Product
        .find({ _id: { $ne: req.product }, category: req.product.category })
        .populate("category", "_id name")
        .limit(limit)
        .exec((err, data) => {
            if (err || !data) return res.status(400).json({ error: "Product not found" });
            return res.status(200).json({ data })
        })
}

exports.listCategories = (req, res) => {
    Product
        .distinct("category", null, (err, categories) => {
            if (err || !categories) return res.status(400).json({ error: "Category not found" });
            return res.status(200).json(categories)
        })
}

exports.listBySearch = (req, res) => {
    const limit = req.body.limit ? parseInt(req.body.limit) : 100;
    const sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    const order = req.body.order ? req.body.order : "desc";
    const skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else if (key === "name") {
                findArgs[key] = { $regex: new RegExp(req.body.filters[key], 'i') };
            }
            else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    Product.find(findArgs)
        .select("-photo")
        .populate("category", "_id name")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                data
            });
        });
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        res.send(req.product.photo.data);
    }
    next()
}
