const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const CatrgoriesController = require('../controller/categories');


router.get("/", CatrgoriesController.categories_get_all);
router.get("/products/:categoryId", CatrgoriesController.categories_get_products);

router.post("/", checkAdmin, CatrgoriesController.categories_create_category);

router.get("/:categoryId", CatrgoriesController.categories_get_category);

router.patch("/:categoryId", checkAdmin, CatrgoriesController.categories_update_category);

router.delete("/:categoryId", checkAdmin, CatrgoriesController.categories_delete);


module.exports = router;