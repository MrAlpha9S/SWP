const { poolPromise, sql } = require('../configs/sqlConfig');

module.exports = async function (req, res, next) {
  try {
    const auth0Id = req.auth?.payload?.sub;
    if (!auth0Id) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No auth0_id found' });
    }
    const pool = await poolPromise;
    const result = await pool.request()
      .input('auth0_id', sql.NVarChar, auth0Id)
      .query('SELECT role FROM users WHERE auth0_id = @auth0_id');
    const user = result.recordset[0];
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }
    next();
  } catch (error) {
    console.error('adminChecker error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
