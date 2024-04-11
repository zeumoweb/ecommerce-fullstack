const { requiredLogin, getToken } = require("../controllers/auth");
const router = require("express").Router();
const { userById } = require("../controllers/user");
const { productById } = require("../controllers/product");
const { add, read, remove_product, delete_cart } = require("../controllers/cart");


router.post("/cart/add/:userId/:tokenId", requiredLogin, add);

router.delete("/cart/:userId/:tokenId", requiredLogin, remove_product); // Delete a product from the cart
router.delete("/delete/cart/:tokenId", requiredLogin, delete_cart); // Delete the entire cart
router.get("/cart/:userId/:tokenId", requiredLogin, read);

router.param("userId", userById);
router.param("tokenId", getToken);
router.param("productId", productById);

module.exports = router;
