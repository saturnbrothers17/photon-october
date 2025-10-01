const { createClient } = require('@libsql/client');

// Test the database connection with your actual credentials
const client = createClient({
    url: 'libsql://photon-photon7.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        // Try to execute a simple query
        const result = await client.execute('SELECT 1');
        console.log('Database connection successful!');
        console.log('Result:', result);
        
        // Try to create a table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS test_table (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
        `);
        console.log('Table creation successful!');
        
        // Try to insert a record
        await client.execute({
            sql: 'INSERT INTO test_table (name) VALUES (?)',
            args: ['Test Record']
        });
        console.log('Record insertion successful!');
        
        // Try to select records
        const selectResult = await client.execute('SELECT * FROM test_table');
        console.log('Record selection successful!');
        console.log('Selected records:', selectResult.rows);
        
    } catch (error) {
        console.error('Database test failed:', error);
    }
}

testDatabase();