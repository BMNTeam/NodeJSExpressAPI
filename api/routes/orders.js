const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  "use strict";
  res.status(200).json({
    message: 'Order were fetched'
  })
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  "use strict";
  res.status(201).json({
    message: 'Order has caught',
    order: order
  })
});

router.get('/:orderId', (req, res, next) => {
  "use strict";
  res.status(200).json({
    message: 'Here is your ordrer',
    orderId: req.params.orderId
  })

});

router.delete('/:orderId', (req, res, next) => {
  "use strict";
  res.status(200).json({
    message: 'You delete this order',
    orderId: req.params.orderId
  })
});

module.exports = router;
