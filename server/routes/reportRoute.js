const express = require('express');
const reportRouter = express.Router();

const {handleDeleteReport, handleGetReports, handleAddReport} = require('../controllers/reportController')

reportRouter.post('/addreport', handleAddReport)
reportRouter.get('/getreports', handleGetReports)
reportRouter.post('/deletereport', handleDeleteReport)

module.exports = reportRouter;