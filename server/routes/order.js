const { requiredLogin, isAdmin, isAuth, getToken } = require("../controllers/auth");
const router = require("express").Router();
const { userById } = require("../controllers/user");
const { add, read, readOneOrder, getOrderById } = require("../controllers/order");
const { delete_cart } = require("../controllers/cart");


router.post("/order/add/:userId/:token", requiredLogin, add, delete_cart);

router.get("/orders/:userId/:token", requiredLogin, isAdmin, read);
router.get("/order/:orderId/:userId/:token", requiredLogin, isAdmin, readOneOrder);

router.param("userId", userById);
router.param("token", getToken);
router.param("orderId", getOrderById);

module.exports = router;
