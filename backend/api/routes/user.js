const express = require("express");
const router = express.Router();
const CheckAuthMiddleware = require('../middleware/check-login');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const UserController = require('../controller/user');



router.get('/check-login', CheckAuthMiddleware, (req, res) => {

  res.status(200).json({
    message: "Đã đăng nhập.",
    userData: req.userData
  });
});

router.get("/check-admin", checkAdmin, (req, res) => {

  res.status(200).json({
    message: "Đã đăng nhập."
  });
});

router.get("/", checkAdmin, UserController.user_get_all);

router.get("/:userId", UserController.user_get);

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.patch("/update/:userId", checkAuth, UserController.user_update);

router.post("/logout", UserController.user_logout);

router.delete("/:userId", checkAdmin, UserController.user_delete);

module.exports = router;