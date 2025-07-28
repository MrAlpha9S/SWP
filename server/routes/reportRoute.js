const express = require('express');
const reportRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {handleDeleteReport, handleGetReports, handleAddReport} = require('../controllers/reportController')

reportRouter.post('/addreport', checkJwt, handleAddReport)
reportRouter.get('/getreports', checkJwt, handleGetReports)
reportRouter.post('/deletereport', checkJwt, handleDeleteReport)

module.exports = reportRouter;