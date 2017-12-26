const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
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
});

router.post('/', (req, res, next) => {
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

});

router.get('/:orderId', (req, res, next) => {
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

});

router.delete('/:orderId', (req, res, next) => {
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
});

module.exports = router;
