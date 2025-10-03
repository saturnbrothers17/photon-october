const fs = require('fs');

const filePath = 'src/database.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the timezone-naive comparison with timezone-aware one
const oldCode = `        // Calculate status in JavaScript to handle timezones correctly
        const testsWithStatus = result.rows.map((test: any) => {
            let status = 'available';
            
            if (test.start_time && test.end_time) {
                const now = new Date();
                const startTime = new Date(test.start_time);
                const endTime = new Date(test.end_time);
                
                if (now < startTime) {
                    status = 'scheduled';
                } else if (now >= startTime && now <= endTime) {
                    status = 'live';
                } else if (now > endTime) {
                    status = 'ended';
                }
            }
            
            return Object.assign({}, test, {
                status: status
            });
        });`;

const newCode = `        // Calculate status in JavaScript with proper timezone handling
        const testsWithStatus = result.rows.map((test: any) => {
            let status = 'available';
            
            if (test.start_time && test.end_time) {
                // Get current time in IST (UTC+5:30)
                const now = new Date();
                const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
                const nowIST = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
                
                // Parse times as IST
                const startTime = new Date(test.start_time);
                const endTime = new Date(test.end_time);
                
                if (nowIST < startTime) {
                    status = 'scheduled';
                } else if (nowIST >= startTime && nowIST <= endTime) {
                    status = 'live';
                } else if (nowIST > endTime) {
                    status = 'ended';
                }
            }
            
            return Object.assign({}, test, {
                status: status
            });
        });`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed timezone handling in getTestsWithStatus');
