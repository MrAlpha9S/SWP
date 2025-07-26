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
  let userUpdated = true;
  if (fields.length > 0) {
    const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = @id`;
    const req = pool.request().input('id', sql.Int, id);
    if (data.username) req.input('username', sql.NVarChar, data.username);
    if (data.email) req.input('email', sql.NVarChar, data.email);
    if (data.role) req.input('role', sql.NVarChar, data.role);
    if (data.avatar) req.input('avatar', sql.NVarChar, data.avatar);
    if (typeof data.isBanned !== 'undefined') req.input('isBanned', sql.Bit, data.isBanned);
    const result = await req.query(query);
    userUpdated = result.rowsAffected[0] > 0;
  }
  // Nếu là coach, cập nhật coach_info
  if (data.bio !== undefined || data.years_of_exp !== undefined || data.detailed_bio !== undefined || data.motto !== undefined) {
    // Kiểm tra đã có coach_info chưa
    const check = await pool.request().input('id', sql.Int, id).query('SELECT * FROM coach_info WHERE coach_id = @id');
    if (check.recordset.length > 0) {
      // Update
      const updateFields = [];
      if (data.bio !== undefined) updateFields.push('bio = @bio');
      if (data.years_of_exp !== undefined) updateFields.push('years_of_exp = @years_of_exp');
      if (data.detailed_bio !== undefined) updateFields.push('detailed_bio = @detailed_bio');
      if (data.motto !== undefined) updateFields.push('motto = @motto');
      if (updateFields.length > 0) {
        const req = pool.request().input('id', sql.Int, id);
        if (data.bio !== undefined) req.input('bio', sql.NVarChar, data.bio);
        if (data.years_of_exp !== undefined) req.input('years_of_exp', sql.Int, data.years_of_exp);
        if (data.detailed_bio !== undefined) req.input('detailed_bio', sql.NVarChar, data.detailed_bio);
        if (data.motto !== undefined) req.input('motto', sql.NVarChar, data.motto);
        await req.query(`UPDATE coach_info SET ${updateFields.join(', ')} WHERE coach_id = @id`);
      }
    } else {
      // Insert
      await pool.request()
        .input('coach_id', sql.Int, id)
        .input('years_of_exp', sql.Int, data.years_of_exp || null)
        .input('bio', sql.NVarChar, data.bio || null)
        .input('detailed_bio', sql.NVarChar, data.detailed_bio || null)
        .input('motto', sql.NVarChar, data.motto || null)
        .query('INSERT INTO coach_info (coach_id, years_of_exp, bio, detailed_bio, motto) VALUES (@coach_id, @years_of_exp, @bio, @detailed_bio, @motto)');
    }
  }
  return userUpdated;
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
  const result = await pool.request().query(`
    SELECT u.*, ci.bio, ci.years_of_exp, ci.detailed_bio, ci.motto
    FROM users u
    LEFT JOIN coach_info ci ON u.user_id = ci.coach_id
    WHERE u.role = 'Coach'
  `);
  return result.recordset;
}
async function getCoachDetailsById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query(`
    SELECT u.*, ci.bio, ci.years_of_exp, ci.detailed_bio, ci.motto
    FROM users u
    LEFT JOIN coach_info ci ON u.user_id = ci.coach_id
    WHERE u.user_id = @id AND u.role = 'Coach'
  `);
  return result.recordset[0];
}

// POST
async function getAllPosts() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      sp.post_id, sp.title, sp.content, sp.created_at,
      sc.category_name,
      u.username, u.avatar,
      COUNT(DISTINCT sl.like_id) AS likes,
      COUNT(DISTINCT scmt.comment_id) AS comments
    FROM social_posts sp
    JOIN social_category sc ON sc.category_id = sp.category_id
    JOIN users u ON sp.user_id = u.user_id
    LEFT JOIN social_likes sl ON sp.post_id = sl.post_id
    LEFT JOIN social_comments scmt ON sp.post_id = scmt.post_id
    GROUP BY sp.post_id, sp.title, sp.content, sp.created_at, sc.category_name, u.username, u.avatar
    ORDER BY sp.created_at DESC
  `);
  return result.recordset;
}
async function getPostById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM social_posts WHERE post_id = @id');
  return result.recordset[0];
}
async function createPost(data) {
  const pool = await poolPromise;
  const req = pool.request();
  req.input('category_id', sql.Int, data.category_id);
  req.input('user_id', sql.Int, data.user_id);
  req.input('title', sql.NVarChar, data.title);
  req.input('content', sql.NVarChar, data.content);
  req.input('created_at', sql.DateTime, data.created_at || new Date());
  req.input('is_pinned', sql.Bit, data.is_pinned || 0);
  req.input('is_reported', sql.Bit, data.is_reported || 0);
  const result = await req.query('INSERT INTO social_posts (category_id, user_id, title, content, created_at, is_pinned, is_reported) VALUES (@category_id, @user_id, @title, @content, @created_at, @is_pinned, @is_reported)');
  return result.rowsAffected[0] > 0;
}
async function updatePost(id, data) {
  const pool = await poolPromise;
  const fields = [];
  if (data.category_id !== undefined) fields.push('category_id = @category_id');
  if (data.title !== undefined) fields.push('title = @title');
  if (data.content !== undefined) fields.push('content = @content');
  if (data.is_pinned !== undefined) fields.push('is_pinned = @is_pinned');
  if (data.is_reported !== undefined) fields.push('is_reported = @is_reported');
  if (fields.length === 0) return false;
  const req = pool.request().input('id', sql.Int, id);
  if (data.category_id !== undefined) req.input('category_id', sql.Int, data.category_id);
  if (data.title !== undefined) req.input('title', sql.NVarChar, data.title);
  if (data.content !== undefined) req.input('content', sql.NVarChar, data.content);
  if (data.is_pinned !== undefined) req.input('is_pinned', sql.Bit, data.is_pinned);
  if (data.is_reported !== undefined) req.input('is_reported', sql.Bit, data.is_reported);
  const result = await req.query(`UPDATE social_posts SET ${fields.join(', ')} WHERE post_id = @id`);
  return result.rowsAffected[0] > 0;
}
async function deletePostById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM social_posts WHERE post_id = @id');
  return result.rowsAffected[0] > 0;
}
async function getPostLikes(postId) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('postId', sql.Int, postId)
    .query(`
      SELECT u.user_id, u.username, u.avatar, u.email
      FROM social_likes sl
      JOIN users u ON sl.user_id = u.user_id
      WHERE sl.post_id = @postId
    `);
  return result.recordset;
}

// COMMENT
async function getAllComments() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      scmt.comment_id, scmt.content, scmt.created_at,
      u.username, u.avatar,
      sp.post_id, sp.title as post_title
    FROM social_comments scmt
    JOIN users u ON scmt.user_id = u.user_id
    JOIN social_posts sp ON scmt.post_id = sp.post_id
    ORDER BY scmt.created_at DESC
  `);
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
  const result = await pool.request().query(`
    SELECT b.*, u.username, u.avatar
    FROM blog_posts b
    JOIN users u ON b.user_id = u.user_id
    ORDER BY b.created_at DESC
  `);
  return result.recordset;
}
async function getBlogById(id) {
  const pool = await poolPromise;
  const result = await pool.request().input('id', sql.Int, id).query(`
    SELECT b.*, u.username, u.avatar
    FROM blog_posts b
    JOIN users u ON b.user_id = u.user_id
    WHERE b.blog_id = @id
  `);
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
  const result = await pool.request().query(`
    SELECT t.topic_id, t.topic_name, t.topic_content,
      COUNT(bp.blog_id) AS postCount
    FROM Topics t
    LEFT JOIN blog_posts bp ON t.topic_id = bp.topic_id
    GROUP BY t.topic_id, t.topic_name, t.topic_content
    ORDER BY t.topic_id
  `);
  return result.recordset;
}
async function createTopic(topic_id, topic_name, topic_content) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('topic_id', sql.NVarChar, topic_id)
    .input('topic_name', sql.NVarChar, topic_name)
    .input('topic_content', sql.NVarChar, topic_content)
    .query('INSERT INTO Topics (topic_id, topic_name, topic_content) VALUES (@topic_id, @topic_name, @topic_content)');
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
  const result = await pool.request().query(`
    SELECT c.*, u.username
    FROM checkin_log c
    JOIN users u ON c.user_id = u.user_id
  `);
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

// USER SUBSCRIPTIONS CRUD
async function getAllUserSubscriptions() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT us.user_id, u.username, u.email, u.avatar,
           us.sub_id, s.sub_name, s.price,
           us.purchased_date, u.vip_end_date
    FROM users_subscriptions us
    JOIN users u ON us.user_id = u.user_id
    JOIN subscriptions s ON us.sub_id = s.sub_id
    ORDER BY us.purchased_date DESC
  `);
  return result.recordset;
}
async function createUserSubscription(data) {
  const pool = await poolPromise;
  const req = pool.request();
  req.input('user_id', sql.Int, data.user_id);
  req.input('sub_id', sql.Int, data.sub_id);
  req.input('purchased_date', sql.DateTime, data.purchased_date);
  req.input('end_date', sql.DateTime, data.end_date);
  const result = await req.query('INSERT INTO users_subscriptions (user_id, sub_id, purchased_date, end_date) VALUES (@user_id, @sub_id, @purchased_date, @end_date)');
  return result.rowsAffected[0] > 0;
}
async function updateUserSubscription(user_id, sub_id, data) {
  const pool = await poolPromise;
  const req = pool.request();
  req.input('user_id', sql.Int, user_id);
  req.input('sub_id', sql.Int, sub_id);
  if (data.purchased_date) req.input('purchased_date', sql.DateTime, data.purchased_date);
  if (data.end_date) req.input('end_date', sql.DateTime, data.end_date);
  const fields = [];
  if (data.purchased_date) fields.push('purchased_date = @purchased_date');
  if (data.end_date) fields.push('end_date = @end_date');
  if (fields.length === 0) return false;
  const result = await req.query(`UPDATE users_subscriptions SET ${fields.join(', ')} WHERE user_id = @user_id AND sub_id = @sub_id`);
  return result.rowsAffected[0] > 0;
}
async function deleteUserSubscription(user_id, sub_id) {
  const pool = await poolPromise;
  const result = await pool.request().input('user_id', sql.Int, user_id).input('sub_id', sql.Int, sub_id).query('DELETE FROM users_subscriptions WHERE user_id = @user_id AND sub_id = @sub_id');
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
  const topicCount = (await pool.request().query('SELECT COUNT(*) as total FROM Topics')).recordset[0].total;
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

  // Thống kê user đăng ký theo tháng (bảng users vẫn dùng created_at)
  const monthlyUsers = (await pool.request().query(`
    SELECT CONVERT(VARCHAR(7), created_at, 120) as month, COUNT(*) as count
    FROM users
    WHERE created_at IS NOT NULL
    GROUP BY CONVERT(VARCHAR(7), created_at, 120)
    ORDER BY month
  `)).recordset;

  // Thống kê check-in theo tháng (bảng checkin_log dùng logged_at)
  const monthlyCheckins = (await pool.request().query(`
    SELECT CONVERT(VARCHAR(7), logged_at, 120) as month, COUNT(*) as count
    FROM checkin_log
    WHERE logged_at IS NOT NULL
    GROUP BY CONVERT(VARCHAR(7), logged_at, 120)
    ORDER BY month
  `)).recordset;

  return {
    userCount,
    coachCount,
    postCount,
    commentCount,
    blogCount,
    topicCount,
    checkinCount,
    subscriptionCount,
    totalRevenue,
    monthlyUsers,
    monthlyCheckins
  };
}

// USER ACHIEVEMENTS
async function getAllUserAchievements() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT ua.user_id, u.username, ua.achievement_id, a.achievement_name, a.criteria, ua.achieved_at
    FROM user_achievements ua
    JOIN users u ON ua.user_id = u.user_id
    JOIN achievements a ON ua.achievement_id = a.achievement_id
    ORDER BY ua.achieved_at DESC
  `);
  return result.recordset;
}
async function createUserAchievement(user_id, achievement_id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('achievement_id', sql.NVarChar, achievement_id)
    .input('achieved_at', sql.DateTime, new Date())
    .query('INSERT INTO user_achievements (user_id, achievement_id, achieved_at) VALUES (@user_id, @achievement_id, @achieved_at)');
  return result.rowsAffected[0] > 0;
}
async function deleteUserAchievement(user_id, achievement_id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('achievement_id', sql.NVarChar, achievement_id)
    .query('DELETE FROM user_achievements WHERE user_id = @user_id AND achievement_id = @achievement_id');
  return result.rowsAffected[0] > 0;
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
  createPost,
  updatePost,
  deletePostById,
  getPostLikes,
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
  getAllUserSubscriptions,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
  getStatistics,
  getAllUserAchievements,
  createUserAchievement,
  deleteUserAchievement,
};