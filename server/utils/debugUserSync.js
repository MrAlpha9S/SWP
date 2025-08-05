const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserFromAuth0} = require("../services/auth0Service");

// Hàm để tìm user theo email trong database
async function findUserByEmailInDB(email) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM users WHERE email = @email');
        return result.recordset;
    } catch (error) {
        console.error('Error finding user by email:', error);
        return [];
    }
}

// Hàm để cập nhật Auth0 ID cho user
async function updateUserAuth0Id(userId, newAuth0Id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .input('auth0_id', sql.NVarChar, newAuth0Id)
            .query('UPDATE users SET auth0_id = @auth0_id WHERE user_id = @user_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error updating user Auth0 ID:', error);
        return false;
    }
}

// Hàm để kiểm tra và sửa lỗi đồng bộ user
async function debugAndFixUserSync(email) {
    console.log(`\n=== Debugging user sync for email: ${email} ===`);
    
    // 1. Tìm user trong database
    const dbUsers = await findUserByEmailInDB(email);
    console.log(`Found ${dbUsers.length} user(s) in database with email: ${email}`);
    
    if (dbUsers.length === 0) {
        console.log('No user found in database with this email');
        return;
    }
    
    // 2. Kiểm tra từng user
    for (const dbUser of dbUsers) {
        console.log(`\n--- User ID: ${dbUser.user_id} ---`);
        console.log(`Database Auth0 ID: ${dbUser.auth0_id}`);
        console.log(`Username: ${dbUser.username}`);
        console.log(`Email: ${dbUser.email}`);
        
        // 3. Thử lấy thông tin từ Auth0
        try {
            const auth0User = await getUserFromAuth0(dbUser.auth0_id);
            console.log(`Auth0 user found: ${auth0User.user_id}`);
            console.log(`Auth0 email: ${auth0User.email}`);
            
            // Kiểm tra xem Auth0 ID có khớp không
            if (auth0User.user_id !== dbUser.auth0_id) {
                console.log(`⚠️  MISMATCH: Database Auth0 ID (${dbUser.auth0_id}) != Auth0 user_id (${auth0User.user_id})`);
                console.log('This is likely the cause of the duplicate user issue!');
                
                // Hỏi user có muốn sửa không
                console.log('\nTo fix this, you can:');
                console.log('1. Update the database Auth0 ID to match Auth0');
                console.log('2. Or create a new user with the correct Auth0 ID');
            } else {
                console.log('✅ Auth0 ID matches - this user should work correctly');
            }
        } catch (error) {
            console.log(`❌ Error getting Auth0 user: ${error.message}`);
            console.log('This user might have been deleted from Auth0 or has invalid Auth0 ID');
        }
    }
}

// Hàm để sửa Auth0 ID cho user
async function fixUserAuth0Id(userId, correctAuth0Id) {
    console.log(`\n=== Fixing Auth0 ID for user ${userId} ===`);
    console.log(`New Auth0 ID: ${correctAuth0Id}`);
    
    const success = await updateUserAuth0Id(userId, correctAuth0Id);
    if (success) {
        console.log('✅ Auth0 ID updated successfully');
    } else {
        console.log('❌ Failed to update Auth0 ID');
    }
    return success;
}

module.exports = {
    findUserByEmailInDB,
    updateUserAuth0Id,
    debugAndFixUserSync,
    fixUserAuth0Id
}; 