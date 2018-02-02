const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
  "use strict";
  Order.find()
      .populate('product', 'name price')
      .exec()
      .then( (docs) => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + doc._id
              }
            }
          }),

        })
      })
      .catch( (err) => {
        res.status(500).json({
          error: err
        })
      })
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
      .then( product => {
        if(!product) {
          return res.status(404).json({
            message: 'Product not found',

          })
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        console.log(Order);
        return order
            .save()

      })
      .then( result => {
        console.dir(result);
         res.status(201).json({
          message: 'Order Stored',
          createdProduct: {
            _id: result.id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result._id
          }
        })
      })
      .catch( err => {
        console.dir(err);
        res.status(500).json({
          message: 'Product does not exists',
          error: err
        })
      });

};

exports.ordersGetOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
      .populate('product', 'name price')
      .exec()
      .then(order => {
        res.status(200).json({
          order,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/'
          }
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })

}

exports.ordersDeleteOrder = (req, res, next) => {
  Order.remove(req.params.orderId)
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Order deleted',
          request: {
            type: 'POST',
            url: 'http://localhost:3000/orders',
            body: {productId: "ID", quantity: 'Number'}
          }
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
}