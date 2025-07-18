const { poolPromise, sql } = require('../configs/sqlConfig');

module.exports = function (req, res, next) {
  // Bỏ qua xác thực admin để test API
  next();
};
