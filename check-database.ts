import { client } from './src/database';

async function checkDatabase() {
    try {
        console.log('Checking database connection and structure...');
        
        // Test basic connectivity
        const testResult = await client.execute('SELECT 1');
        console.log('Database connection test:', testResult.rows[0]);
        
        // Check if users table exists and get its structure
        try {
            const tableInfo = await client.execute({
                sql: "PRAGMA table_info(users)"
            });
            
            console.log('Users table structure:');
            if (tableInfo.rows.length > 0) {
                tableInfo.rows.forEach(row => {
                    console.log(`  ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''} ${row.pk ? 'PRIMARY KEY' : ''}`);
                });
            } else {
                console.log('  Users table does not exist or is empty');
            }
        } catch (error) {
            console.log('Users table does not exist:', error.message);
        }
        
        // Check if other tables exist
        const tables = ['courses', 'faculty', 'testimonials', 'students'];
        for (const table of tables) {
            try {
                const tableInfo = await client.execute({
                    sql: `SELECT COUNT(*) as count FROM ${table}`
                });
                console.log(`${table} table: ${tableInfo.rows[0].count} records`);
            } catch (error) {
                console.log(`${table} table: Does not exist or inaccessible`);
            }
        }
        
    } catch (error) {
        console.error('Error checking database:', error);
    }
}

checkDatabase();