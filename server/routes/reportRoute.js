const express = require('express');
const reportRouter = express.Router();

const {handleAddReport} = require('../controllers/reportController')

reportRouter.post('/addreport', handleAddReport)

module.exports = reportRouter;