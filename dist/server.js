"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./database");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 7000;
// Middleware - Increase payload limit for large test creation
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads'))); // Serve uploaded files
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)()); // Add cookie parser middleware
// Set view engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Initialize database
(0, database_1.initializeDatabase)();
// Routes
const index_1 = __importDefault(require("./routes/index"));
const courses_1 = __importDefault(require("./routes/courses"));
const studentCorner_1 = __importDefault(require("./routes/studentCorner"));
const teacherDashboard_1 = __importDefault(require("./routes/teacherDashboard"));
const contact_1 = __importDefault(require("./routes/contact"));
const auth_1 = __importDefault(require("./routes/auth"));
const aiExtractor_1 = __importDefault(require("./routes/aiExtractor"));
app.use('/', index_1.default);
app.use('/courses', courses_1.default);
app.use('/student-corner', studentCorner_1.default);
app.use('/teacher-dashboard', teacherDashboard_1.default);
app.use('/contact', contact_1.default);
app.use('/auth', auth_1.default);
app.use('/ai-extractor', aiExtractor_1.default); // Add AI extractor routes
// Start server - Listen on all network interfaces (0.0.0.0) to allow mobile access
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Network: http://192.168.1.40:${PORT}`);
    console.log(`\nTo access from mobile on same WiFi, use: http://192.168.1.40:${PORT}`);
});
