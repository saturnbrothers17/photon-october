import { client } from './src/database';

async function checkUsers() {
    try {
        console.log('Checking current users in database...');
        
        const result = await client.execute({
            sql: 'SELECT * FROM users'
        });
        
        console.log('Current users in database:');
        console.log('Rows found:', result.rows.length);
        
        if (result.rows.length > 0) {
            console.log('User details:');
            result.rows.forEach((row, index) => {
                console.log(`User ${index + 1}:`, row);
            });
        } else {
            console.log('No users found in the database.');
        }
    } catch (error) {
        console.error('Error checking users:', error);
    }
}

checkUsers();