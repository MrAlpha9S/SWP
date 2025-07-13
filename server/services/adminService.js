const { poolPromise, sql } = require('../configs/sqlConfig');

// USER
async function getAllUsers() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM users');
  return result.recordset;
}
async function createUser(data) {
  const pool = await poolPromise;
  const req = pool.request();
  // Tạo auth0_id tự động nếu không có
  const auth0_id = data.auth0_id || `admin|${Date.now()}`;
  req.input('auth0_id', sql.NVarChar, auth0_id);
  req.input('username', sql.NVarChar, data.username);
  req.input('email', sql.NVarChar, data.email);
  req.input('role', sql.NVarChar, data.role || 'Member');
  req.input('avatar', sql.NVarChar, data.avatar || null);
  req.input('isBanned', sql.Bit, data.isBanned !== undefined ? data.isBanned : false);
  // created_at mặc định là thời điểm hiện tại
  req.input('created_at', sql.DateTime, new Date());
  req.input('is_social', sql.Bit, 0);
  // sub_id mặc định là 1
  req.input('sub_id', sql.Int, 1);
  const result = await req.query(
    'INSERT INTO users (auth0_id, username, email, role, avatar, isBanned, created_at, is_social, sub_id) VALUES (@auth0_id, @username, @email, @role, @avatar, @isBanned, @created_at, @is_social, @sub_id)'
  );
  return result.rowsAffected[0] > 0;
}
async function getUserById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM users WHERE user_id = @id');
  return result.recordset[0];
}
async function updateUserById(id, data) {
  const pool = await poolPromise;
  const fields = [];
  if (data.username) fields.push(`username = @username`);
  if (data.email) fields.push(`email = @email`);
  if (data.role) fields.push(`role = @role`);
  if (data.avatar) fields.push(`avatar = @avatar`);
  if (typeof data.isBanned !== 'undefined') fields.push(`isBanned = @isBanned`);
  if (fields.length === 0) return false;
  const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = @id`;
  const req = pool.request().input('id', sql.Int, id);
  if (data.username) req.input('username', sql.NVarChar, data.username);
  if (data.email) req.input('email', sql.NVarChar, data.email);
  if (data.role) req.input('role', sql.NVarChar, data.role);
  if (data.avatar) req.input('avatar', sql.NVarChar, data.avatar);
  if (typeof data.isBanned !== 'undefined') req.input('isBanned', sql.Bit, data.isBanned);
  const result = await req.query(query);
  return result.rowsAffected[0] > 0;
}
async function deleteUserById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM users WHERE user_id = @id');
  return result.rowsAffected[0] > 0;
}
async function toggleBanUserById(id, isBanned) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).input('isBanned', sql.Bit, isBanned).query('UPDATE users SET isBanned = @isBanned WHERE user_id = @id');
  return result.rowsAffected[0] > 0;
}
async function getCoaches() {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM users WHERE role = 'Coach'");
  return result.recordset;
}
async function getCoachDetailsById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query("SELECT * FROM users WHERE user_id = @id AND role = 'Coach'");
  return result.recordset[0];
}

// POST
async function getAllPosts() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM social_posts');
  return result.recordset;
}
async function getPostById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM social_posts WHERE post_id = @id');
  return result.recordset[0];
}
async function deletePostById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM social_posts WHERE post_id = @id');
  return result.rowsAffected[0] > 0;
}

// COMMENT
async function getAllComments() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM social_comments');
  return result.recordset;
}
async function deleteCommentById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM social_comments WHERE comment_id = @id');
  return result.rowsAffected[0] > 0;
}

// BLOG
async function getAllBlogs() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM blog_posts');
  return result.recordset;
}
async function getBlogById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM blog_posts WHERE blog_id = @id');
  return result.recordset[0];
}
async function deleteBlogById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM blog_posts WHERE blog_id = @id');
  return result.rowsAffected[0] > 0;
}

// TOPIC
async function getAllTopics() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Topics');
  return result.recordset;
}
async function createTopic(topic_name, topic_content) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('topic_name', sql.NVarChar, topic_name)
    .input('topic_content', sql.NVarChar, topic_content)
    .query('INSERT INTO Topics (topic_name, topic_content) VALUES (@topic_name, @topic_content)');
  return result.rowsAffected[0] > 0;
}
async function updateTopic(id, topic_name, topic_content) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('topic_name', sql.NVarChar, topic_name)
    .input('topic_content', sql.NVarChar, topic_content)
    .query('UPDATE Topics SET topic_name = @topic_name, topic_content = @topic_content WHERE topic_id = @id');
  return result.rowsAffected[0] > 0;
}
async function deleteTopic(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM Topics WHERE topic_id = @id');
  return result.rowsAffected[0] > 0;
}

// SUBSCRIPTION
async function getAllSubscriptions() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM subscriptions');
  return result.recordset;
}
async function createSubscription(sub_name, price) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('sub_name', sql.NVarChar, sub_name)
    .input('price', sql.Int, price)
    .query('INSERT INTO subscriptions (sub_name, price) VALUES (@sub_name, @price)');
  return result.rowsAffected[0] > 0;
}
async function updateSubscription(id, sub_name, price) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('sub_name', sql.NVarChar, sub_name)
    .input('price', sql.Int, price)
    .query('UPDATE subscriptions SET sub_name = @sub_name, price = @price WHERE sub_id = @id');
  return result.rowsAffected[0] > 0;
}
async function deleteSubscription(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM subscriptions WHERE sub_id = @id');
  return result.rowsAffected[0] > 0;
}

// CHECK-IN
async function getAllCheckIns() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM checkin_log');
  return result.recordset;
}
async function getCheckInById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM checkin_log WHERE log_id = @id');
  return result.recordset[0];
}
async function deleteCheckInById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM checkin_log WHERE log_id = @id');
  return result.rowsAffected[0] > 0;
}

// STATISTICS
async function getStatistics() {
  const pool = await poolPromise;
  const userCount = (await pool.request().query('SELECT COUNT(*) as total FROM users')).recordset[0].total;
  const coachCount = (await pool.request().query("SELECT COUNT(*) as total FROM users WHERE role = 'Coach'")).recordset[0].total;
  const postCount = (await pool.request().query('SELECT COUNT(*) as total FROM social_posts')).recordset[0].total;
  const commentCount = (await pool.request().query('SELECT COUNT(*) as total FROM social_comments')).recordset[0].total;
  const blogCount = (await pool.request().query('SELECT COUNT(*) as total FROM blog_posts')).recordset[0].total;
  const checkinCount = (await pool.request().query('SELECT COUNT(*) as total FROM checkin_log')).recordset[0].total;
  const subscriptionCount = (await pool.request().query('SELECT COUNT(*) as total FROM subscriptions')).recordset[0].total;
  let totalRevenue = null;
  try {
    const revenueResult = await pool.request().query(`
      SELECT SUM(s.price) as total
      FROM users_subscriptions us
      JOIN subscriptions s ON us.sub_id = s.sub_id
    `);
    totalRevenue = revenueResult.recordset[0].total || 0;
  } catch (e) {
    totalRevenue = null;
  }
  return {
    userCount,
    coachCount,
    postCount,
    commentCount,
    blogCount,
    checkinCount,
    subscriptionCount,
    totalRevenue
  };
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  toggleBanUserById,
  getCoaches,
  getCoachDetailsById,
  getAllPosts,
  getPostById,
  deletePostById,
  getAllComments,
  deleteCommentById,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  getAllTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAllCheckIns,
  getCheckInById,
  deleteCheckInById,
  getStatistics
}; 