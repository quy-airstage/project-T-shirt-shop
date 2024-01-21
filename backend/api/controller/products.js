
const mongoose = require("mongoose");
const Product = require("../models/product");

// id_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//     name_product: { type: String, required: true },
//     price: { type: Number, required: true },
//     discount: { type: Number, default: 0 },
//     describe: { type: String },
//     productImage: { type: String },
//     createdAt: { type: String, timestamps: true }

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("_id id_category name_product price discount describe sizeList productImage productImageSub listImgProduct createdAt")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            id_category: doc.id_category,
            name_product: doc.name_product,
            price: doc.price,
            discount: doc.discount,
            describe: doc.describe,
            list_size: doc.sizeList,
            main_img_product: doc.productImage,
            sub_img_product: doc.productImageSub,
            list_img: doc.listImgProduct,
            created_at: doc.createdAt,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
  // console.log("running");
  // console.log(req.file.path);
  // const product = new Product({
  //   _id: new mongoose.Types.ObjectId(),
  //   id_category: req.body.id_category,
  //   name_product: req.body.name_product,
  //   price: req.body.price,
  //   discount: req.body.discount,
  //   describe: req.body.describe,
  //   productImage: req.file.path,
  //   productImageSub: req.file.path
  // });
  const productData = {
    id_category: req.body.id_category,
    name_product: req.body.name_product,
    price: req.body.price,
    discount: req.body.discount,
    describe: req.body.describe
  };
  if (req.body.sizeList) {
    let sizeList = []
    for (let i = 0; i < req.body.sizeList.length; i++) {
      sizeList = [...sizeList, JSON.parse(req.body.sizeList[i])]
    }
    productData.sizeList = sizeList.map(value => (
      {
        size: value.size,
        inStock: value.inStock
      }
    ));
  }

  if (req.files && req.files.productImage) {
    productData.productImage = req.files.productImage[0].path;
  }

  if (req.files && req.files.productImageSub) {
    productData.productImageSub = req.files.productImageSub[0].path;
  }
  if (req.files && req.files.listImgProduct) {
    productData.listImgProduct = req.files.listImgProduct.map(file => ({ img: file.path }));
  }


  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    createdAt: Date.now(),
    ...productData
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Tạo mới sản phẩm thành công.",
        createdProduct: {
          _id: result._id,
          id_category: result.id_category,
          name_product: result.name_product,
          price: result.price,
          discount: result.discount,
          describe: result.describe,
          list_size: result.sizeList,
          main_img_product: result.productImage,
          sub_img_product: result.productImageSub,
          list_img: result.listImgProduct,
          created_at: result.createdAt,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_get_latest = (req, res, next) => {
  Product.find()
    .select("_id id_category name_product price discount describe sizeList productImage productImageSub listImgProduct createdAt")
    .sort({ createdAt: -1 })
    .limit(6)
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            id_category: doc.id_category,
            name_product: doc.name_product,
            price: doc.price,
            discount: doc.discount,
            describe: doc.describe,
            list_size: doc.sizeList,
            main_img_product: doc.productImage,
            sub_img_product: doc.productImageSub,
            list_img: doc.listImgProduct,
            created_at: doc.createdAt,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.decreaseStock = (req, res, next) => {
  const productId = req.params.productId;

  const size = req.body.size;
  const decreaseAmount = req.body.decreaseAmount;

  Product.updateOne(
    {
      _id: productId,
      "sizeList.size": size // Find the product with the specified size
    },
    {
      $inc: {
        "sizeList.$.inStock": -decreaseAmount // Decrement the inStock value by the specified amount
      }
    }
  )
    .exec()
    .then(result => {
      if (result.nModified === 1) {
        // Check if one document was modified
        res.status(200).json({
          message: "Size updated successfully"
        });
      } else {
        res.status(404).json({
          message: "Product not found or size not available"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("_id id_category name_product price discount describe sizeList productImage productImageSub listImgProduct createdAt")
    .populate("id_category")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: {
            id_category: doc.id_category._id,
            name_category: doc.id_category.name_category,
            name_product: doc.name_product,
            price: doc.price,
            discount: doc.discount,
            describe: doc.describe,
            list_size: doc.sizeList,
            main_img_product: doc.productImage,
            sub_img_product: doc.productImageSub,
            list_img: doc.listImgProduct,
            created_at: doc.createdAt,
            _id: doc._id,
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {
    id_category: req.body.id_category,
    name_product: req.body.name_product,
    price: req.body.price,
    discount: req.body.discount,
    describe: req.body.describe
  };

  if (req.body.sizeList) {
    let sizeList = []
    for (let i = 0; i < req.body.sizeList.length; i++) {
      sizeList = [...sizeList, JSON.parse(req.body.sizeList[i])]
    }
    updateOps.sizeList = sizeList.map(value => (
      {
        size: value.size,
        inStock: value.inStock
      }
    ));
  }

  if (req.files && req.files.productImage) {
    updateOps.productImage = req.files.productImage[0].path;
  }

  if (req.files && req.files.productImageSub) {
    updateOps.productImageSub = req.files.productImageSub[0].path;
  }
  if (req.files && req.files.listImgProduct) {
    updateOps.listImgProduct = req.files.listImgProduct.map(file => ({ img: file.path }));

  }
  console.log(updateOps.listImgProduct);
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Cập nhật thông tin sản phẩm thành công.",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Xóa sản phẩm thành công",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { id_category: "ID", name_product: "String", price: "Number", discount: "Number default:0", describe: "String can null" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};