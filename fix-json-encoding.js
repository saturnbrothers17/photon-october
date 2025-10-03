const fs = require('fs');

const filePath = 'src/views/test-result.ejs';
let content = fs.readFileSync(filePath, 'utf8');

// Fix: Use base64 encoding for the options data to avoid all escaping issues
const oldButton = `                                        <button 
                                            class="ai-solution-btn px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-all"
                                            data-question-index="<%= index %>"
                                            data-question-text="<%= question.question_text.replace(/"/g, '&quot;') %>"
                                            data-options='<%= JSON.stringify(question.options.map(o => o.option_text)).replace(/'/g, "\\\\'") %>'
                                            data-correct-answer="<%= correctIndex %>"
                                            data-user-answer="<%= userAnswer %>">
                                            <i class="fas fa-robot mr-2"></i> Niko Solution
                                        </button>`;

const newButton = `                                        <button 
                                            class="ai-solution-btn px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-all"
                                            data-question-index="<%= index %>"
                                            data-question-text="<%= question.question_text.replace(/"/g, '&quot;') %>"
                                            data-options-json="<%= Buffer.from(JSON.stringify(question.options.map(o => o.option_text))).toString('base64') %>"
                                            data-correct-answer="<%= correctIndex %>"
                                            data-user-answer="<%= userAnswer %>">
                                            <i class="fas fa-robot mr-2"></i> Niko Solution
                                        </button>`;

content = content.replace(oldButton, newButton);

// Update the JavaScript to decode base64
const oldJS = `                const options = JSON.parse(this.dataset.options);`;
const newJS = `                const options = JSON.parse(atob(this.dataset.optionsJson));`;

content = content.replace(oldJS, newJS);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed JSON encoding using base64');
