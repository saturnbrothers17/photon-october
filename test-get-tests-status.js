const { createClient } = require('@libsql/client');

const client = createClient({
    url: 'libsql://photon-photon7.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});

async function getTestsWithStatus() {
    try {
        const result = await client.execute(`
            SELECT 
                id, 
                title, 
                description, 
                subject, 
                duration, 
                scheduled_date,
                start_time,
                end_time,
                created_at
            FROM tests 
            ORDER BY created_at DESC
        `);
        
        // Calculate status in JavaScript to handle timezones correctly
        const testsWithStatus = result.rows.map((test) => {
            let status = 'available';
            
            if (test.start_time && test.end_time) {
                const now = new Date();
                const startTime = new Date(test.start_time);
                const endTime = new Date(test.end_time);
                
                console.log(`Test: ${test.title}`);
                console.log(`  Now: ${now}`);
                console.log(`  Start: ${startTime}`);
                console.log(`  End: ${endTime}`);
                
                if (now < startTime) {
                    status = 'scheduled';
                } else if (now >= startTime && now <= endTime) {
                    status = 'live';
                } else if (now > endTime) {
                    status = 'ended';
                }
                
                console.log(`  Status: ${status}\n`);
            }
            
            return {
                ...test,
                status: status
            };
        });
        
        console.log('Final result:');
        console.log(JSON.stringify(testsWithStatus, null, 2));
        
        return testsWithStatus;
    } catch (error) {
        console.error('Error fetching tests with status:', error);
        return [];
    }
}

getTestsWithStatus().then(() => client.close());
