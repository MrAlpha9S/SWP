const express = require('express');
const paymentRouter = express.Router();
const { createOrder } = require('../controllers/paymentController');

paymentRouter.post('/create-order', createOrder);

module.exports = paymentRouter;