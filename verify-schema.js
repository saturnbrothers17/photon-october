const { client } = require('./dist/database.js');

async function verifySchema() {
    try {
        console.log('Verifying database schema...');
        
        // Check the structure of the users table
        const tableInfo = await client.execute("PRAGMA table_info(users)");
        console.log('Users table structure:');
        console.log(tableInfo.rows);
        
        // Check if there are any users
        const usersResult = await client.execute('SELECT * FROM users');
        console.log('Existing users:', usersResult.rows);
        
    } catch (error) {
        console.error('Schema verification error:', error);
    }
}

verifySchema();