const multer = require("multer");
const express = require("express");
const { requiredLogin, isAdmin, isAuth, getToken } = require("../controllers/auth");
const router = require("express").Router();
const { userById } = require("../controllers/user");
const { chat, create, productById, remove, update, read, list, listAllProducts, listRelated, listCategories, listBySearch, photo } = require("../controllers/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
})

const upload = multer({ storage: storage })

router.post("/product/create/:userId/:token", requiredLogin, isAdmin, upload.single('photo'), create);

router.get("/product/:productId", read);
router.delete("/product/:productId/:userId/:token", requiredLogin, isAdmin, remove);

router.put("/product/:productId/:userId/:token", requiredLogin, isAdmin, upload.single('photo'), update);

router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get('/products', list);
router.get("/product/photo/:productId", photo);
router.post("/product/chat", listAllProducts, chat);

router.param("userId", userById);
router.param("token", getToken);
router.param("productId", productById);

module.exports = router;
