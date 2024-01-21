
const mongoose = require("mongoose");
const Category = require("../models/categories");
const Product = require("../models/product");

exports.categories_get_all = (req, res, next) => {
  Category.find()
    .select(" _id name_category")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        categories: docs.map(doc => {
          return {
            name_category: doc.name_category,
            id_category: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/categories/" + doc._id
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

exports.categories_create_category = (req, res, next) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name_category: req.body.name_category
  });
  category
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Tạo mới danh mục thành công",
        createdProduct: {
          name_category: result.name_category,
          id_category: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/categories/" + result._id
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
exports.categories_get_products = (req, res, next) => {
  const categoryId = req.params.categoryId;

  // Use Mongoose to find products in the specified category
  Product.find({ id_category: categoryId })
    .populate("id_category")
    .exec()
    .then(products => {
      if (!products || products.length === 0) {
        return res.status(404).json({
          message: 'Không tìm thấy sản phẩm nào có trong danh mục này.'
        });
      }

      res.status(200).json(products);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: 'Máy chủ xảy ra lỗi.'
      });
    });
}

exports.categories_get_category = (req, res, next) => {
  const id = req.params.categoryId;
  Category.findById(id)
    .select("_id name_category")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          category: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/categories"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "Không tìm thấy danh mục" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.categories_update_category = (req, res, next) => {
  const id = req.params.categoryId;
  const updateOps = {
    name_category: req.body.name_category,
  };

  Category.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Cập nhật danh mục thành công",
        request: {
          type: "GET",
          url: "http://localhost:3000/categories/" + id
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

exports.categories_delete = (req, res, next) => {
  const id = req.params.categoryId;
  Category.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Xóa danh mục thành công",
        request: {
          type: "POST",
          url: "http://localhost:3000/categories",
          body: { name_category: "String" }
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