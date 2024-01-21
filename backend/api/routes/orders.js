const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const OrdersController = require('../controller/orders');

// Handle incoming GET requests to /orders
router.get("/", checkAdmin, OrdersController.orders_get_all);

router.post("/", OrdersController.orders_create_order);

router.get("/:orderId", OrdersController.orders_get_order);

router.get("/user/:userId", OrdersController.orders_get_user_orders);

router.delete("/:orderId", OrdersController.orders_delete_order);

module.exports = router;