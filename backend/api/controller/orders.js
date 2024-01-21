const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
  .select("user_id name_custormer phone_custormer location_custormer products _id createdAt") // Use "createdAt" instead of "created_at"
  .exec()
  .then(docs => {
    
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          user_id: doc.user_id,
          products: doc.products,
          created_at: doc.createdAt, // Use "createdAt" here as well
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + doc._id
          }
        };
      })
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
};

exports.orders_create_order = (req, res, next) => {
  const products = req.body.products;
  const user_id = req.body.user_id;
  const name_custormer = req.body.name;
  const phone_custormer = req.body.phone;
  const location_custormer = req.body.location;
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id,
    name_custormer: name_custormer,
    phone_custormer: phone_custormer,
    location_custormer: location_custormer,
    products: products.map(productOrder => ({
      product: productOrder.productId,
      name: productOrder.name,
      size: productOrder.size,
      cost: productOrder.cost,
      quantity: productOrder.quantity
    })),
    createdAt: Date.now()
  });

  order
    .save()
    .then(result => {
      res.status(201).json({
        message: "Đơn hàng đặt thành công.",
        createdOrder: {
          _id: result._id,
          user_id: result.user_id,
          name_custormer: result.name_custormer,
          phone_custormer: result.phone_custormer,
          location_custormer: result.location_custormer,
          products: result.products,
          created_at: result.createdAt
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
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

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("products.product")
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Không tìm thấy đơn hàng."
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.orders_get_user_orders = (req, res, next) => {
  Order.find({ user_id: req.params.userId }) 
    .exec()
    .then(order => {
      console.log();
      if (!order) {
        return res.status(404).json({
          message: "Bạn chưa mua hàng."
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Đã xóa đơn hàng thành công.",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          header: "Authorization - Bearer Token",
          body: { products: { productId: "ID", name: "String", cost: "Number", quantity: "Number" } }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};