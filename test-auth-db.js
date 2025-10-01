const { client } = require('./dist/database.js');

async function testAuth() {
    try {
        console.log('Testing database authentication...');
        
        // First, let's see if there are any users in the database
        const usersResult = await client.execute('SELECT * FROM users');
        console.log('Existing users:', usersResult.rows);
        
        // If there are users, let's try to authenticate with the first one
        if (usersResult.rows.length > 0) {
            const user = usersResult.rows[0];
            console.log('Testing authentication for user:', user.photon_id);
            
            const authResult = await client.execute({
                sql: 'SELECT * FROM users WHERE photon_id = ? AND password = ?',
                args: [user.photon_id, user.password]
            });
            
            console.log('Authentication result:', authResult.rows);
            if (authResult.rows.length > 0) {
                console.log('Authentication successful!');
            } else {
                console.log('Authentication failed!');
            }
        } else {
            console.log('No users found in database');
        }
    } catch (error) {
        console.error('Test error:', error);
    }
}

testAuth();