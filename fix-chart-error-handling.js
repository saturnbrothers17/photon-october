const fs = require('fs');

const filePath = 'src/views/test-result.ejs';
let content = fs.readFileSync(filePath, 'utf8');

// Wrap Chart.js initialization in try-catch
const oldChartCode = `    <script>
        // Score Distribution Chart
        const ctx = document.getElementById('scoreChart').getContext('2d');
        
        // Calculate answered count
        const answersData = <%- JSON.stringify(answers) %>;
        const answeredCount = Object.keys(answersData).filter(k => answersData[k] !== null).length;
        const incorrectCount = answeredCount - <%= result.correct_answers %>;
        const unattemptedCount = <%= result.total_questions %> - answeredCount;
        
        new Chart(ctx, {`;

const newChartCode = `    <script>
        // Score Distribution Chart with error handling
        try {
            const ctx = document.getElementById('scoreChart').getContext('2d');
            
            // Calculate answered count
            const answersData = <%- JSON.stringify(answers) %>;
            const answeredCount = Object.keys(answersData).filter(k => answersData[k] !== null).length;
            const incorrectCount = answeredCount - <%= result.correct_answers %>;
            const unattemptedCount = <%= result.total_questions %> - answeredCount;
            
            new Chart(ctx, {`;

content = content.replace(oldChartCode, newChartCode);

// Add closing try-catch after chart initialization
const oldChartEnd = `            }
        });
        
        // AI Solution Handler`;

const newChartEnd = `            }
        });
        } catch (error) {
            console.error('Chart initialization error:', error);
        }
        
        // AI Solution Handler`;

content = content.replace(oldChartEnd, newChartEnd);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Added error handling to Chart.js initialization');
