const Product = require('../models/product');
const mongoose = require('mongoose');

exports.productsGetAll = (req, res, next) => {
  Product.find()
      .select('name price _id productImage')
      .exec()
      .then(docs => {
        console.log(docs);
        if( docs.length >= 0) {
          const response = {
            count: docs.length,
            products: docs.map( doc => {
              return {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                productImage: doc.productImage,
                request: {
                  type: 'GET',
                  url: 'http://localhost:3000/products/' + doc._id
                }
              }
            })

          };
          res.status(200).json(response);
        } else {
          res.status(404).json({
            message: 'No entries found'
          })
        }
      })
      .catch(err => {
        console.log(err);
      });

};

exports.productsCreateProduct = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
      .then((result) => {
        console.log(result)
        res.status(201).json({
          message: 'Handling a POST request to the /products',
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + result._id
            }
          }
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        })
      });

};

exports.productsGetProduct = (req, res, next) => {
  "use strict";
  const id = req.params.productId;
  Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(doc => {
        console.log(doc);
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:3000/products'
          }
        })
      })
      .catch(err => console.log(err))

};

exports.productsUpdateProduct = (req, res, next) => {
  "use strict";
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({_id: id}, {$set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
          message: 'Product updated',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        });

      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        })
      });


};

exports.productsDeleteProduct = (req, res, next) => {
  "use strict";
  const id = req.params.productId;
  Product.remove({_id: id})
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Product deleted',
          request: {
            type: 'POST',
            url: 'http://localhost:3000/products/',
            body: {
              name: 'String',
              price: 'Number'
            }
          }
        })
      })
      .catch(err => {
        console.log(err);
      });

  res.status(200).json({
    message: 'Delete product'
  })

};