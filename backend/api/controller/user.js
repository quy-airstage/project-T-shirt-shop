const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
global.global.tokenBlacklist = [];

exports.user_get_all = (req, res, next) => {
  User.find()
    .select("_id email phone fullName location")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            email: doc.email,
            phone: doc.phone,
            full_name: doc.fullName,
            location: doc.location,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/user/" + doc._id
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

exports.user_get = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select("_id email phone fullName location role")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          info: {
            email: doc.email,
            phone: doc.phone,
            full_name: doc.fullName,
            location: doc.location,
            role: doc.role,
            _id: doc._id,
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/user"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "Không tài khoản" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.user_signup = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email }).exec();
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Email đã được đăng ký."
      });
    }
    console.log(req.body.password);
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hash
    });
    const result = await newUser.save();
    console.log(result);
    res.status(201).json({
      message: "Đăng ký tài khoản thành công."
    });
  } catch (error) {
    console.error("Có lỗi xảy ra trong lúc đăng ký:", error);
    res.status(500).json({
      error: "Đăng ký tài khoản thất bại."
    });
  }
};


exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Tài khoản chưa đăng ký"

        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Đăng nhập thất bại."
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: user[0]._id,
              email: user[0].email,
              role: user[0].role
            },
            process.env.JWT_KEY,
            {
              expiresIn: "3d"
            }
          );
          return res.status(200).json({
            message: "Đăng nhập thành công.",
            token: token
          });
        }
        res.status(401).json({
          message: "Đăng nhập thất bại."
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_logout = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  global.tokenBlacklist.push(token);
  res.status(200).json({
    message: "Đăng xuất thành công."
  });
};

exports.user_update = (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {
    email: req.body.email,
    fullName: req.body.full_name,
    phone: req.body.phone,
    location: req.body.location,
  };
  
  User.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Cập nhập tài khoản thành công",
        request: {
          type: "GET",
          url: "http://localhost:3000/user/" + id
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


exports.user_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Đã xóa thành công tài khoản."
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};