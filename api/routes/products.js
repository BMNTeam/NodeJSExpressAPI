const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});



const fileFilter = (req, file, cb) => {
  //reject file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('not matched type'), false)
  }
};

const upload = multer(
    {
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 3
      },
      fileFilter: fileFilter
    });



router.get('/', ProductsController.productsGetAll);

router.post('/', checkAuth,  ProductsController.productsCreateProduct);

router.get('/:productId',checkAuth, ProductsController.productsGetProduct);


router.patch('/:productId', checkAuth, ProductsController.productsUpdateProduct);

router.delete('/:productId', checkAuth, ProductsController.productsDeleteProduct);


module.exports = router;
