import { clearAllUsers } from './src/database';

async function clearUsers() {
    try {
        console.log('Clearing all users from database...');
        const result = await clearAllUsers();
        
        if (result) {
            console.log('Successfully cleared all users from database.');
            console.log('Rows affected:', result.rowsAffected);
        } else {
            console.log('Failed to clear users from database.');
        }
    } catch (error) {
        console.error('Error clearing users:', error);
    }
}

clearUsers();