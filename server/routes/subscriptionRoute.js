const {handleGetSubs} = require('../controllers/subscriptionController');

const express = require('express');
const subscriptionRouter = express.Router();

subscriptionRouter.get('/', handleGetSubs)


module.exports = subscriptionRouter;