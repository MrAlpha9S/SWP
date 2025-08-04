require('dotenv').config();
const { debugAndFixUserSync, fixUserAuth0Id } = require('./utils/debugUserSync');

// Lấy email từ command line argument
const email = process.argv[2];

if (!email) {
    console.log('Usage: node debug-user-sync.js <email>');
    console.log('Example: node debug-user-sync.js user@example.com');
    process.exit(1);
}

async function main() {
    try {
        console.log('🔍 Starting user sync debug for:', email);
        
        // Debug user sync
        await debugAndFixUserSync(email);
        
        console.log('\n✅ Debug completed!');
        console.log('\nNext steps:');
        console.log('1. Check the output above for any mismatches');
        console.log('2. If you see mismatches, you can fix them manually');
        console.log('3. Test the login flow again');
        
    } catch (error) {
        console.error('❌ Error during debug:', error);
    }
}

main(); 