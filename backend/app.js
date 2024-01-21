// import express from 'express';
const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
// const mongoose = require('mongodb')





const categoryRoutes = require("./api/routes/categories");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/user');



const uri_localhost = "mongodb://127.0.0.1:27017/restShop?retryWrites=true&w=majority";
mongoose.connect(uri_localhost);


mongoose.Promise = global.Promise
// mongoose.set('debug', true);
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "it's work!"
//     });
// })
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, POST, DELETE');
        return res.status(200).send();
    }
    next();
});



app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: { message: error.message }
    });
})

module.exports = app;