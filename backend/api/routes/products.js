const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAdmin = require('../middleware/check-admin');
const ProductsController = require('../controller/products');


// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, timestamp + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get("/", ProductsController.products_get_all);

router.get("/new_products", ProductsController.products_get_latest);

router.post("/", checkAdmin, upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productImageSub', maxCount: 1 },
    { name: 'listImgProduct', maxCount: 10 }]), ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product);

router.patch('/updateStock/:productId', ProductsController.decreaseStock);

router.patch("/:productId", checkAdmin, upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productImageSub', maxCount: 1 },
    { name: 'listImgProduct', maxCount: 10 }]), ProductsController.products_update_product);

router.delete("/:productId", checkAdmin, ProductsController.products_delete);


module.exports = router;