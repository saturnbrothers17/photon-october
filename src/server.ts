import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { initializeDatabase } from './database';

const app = express();
const PORT = Number(process.env.PORT) || 7000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploaded files
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parser middleware

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Initialize database
initializeDatabase();

// Routes
import indexRouter from './routes/index';
import coursesRouter from './routes/courses';
import studentCornerRouter from './routes/studentCorner';
import teacherDashboardRouter from './routes/teacherDashboard';
import contactRouter from './routes/contact';
import authRouter from './routes/auth';
import aiExtractorRouter from './routes/aiExtractor';

app.use('/', indexRouter);
app.use('/courses', coursesRouter);
app.use('/student-corner', studentCornerRouter);
app.use('/teacher-dashboard', teacherDashboardRouter);
app.use('/contact', contactRouter);
app.use('/auth', authRouter);
app.use('/ai-extractor', aiExtractorRouter); // Add AI extractor routes

// Start server - Listen on all network interfaces (0.0.0.0) to allow mobile access
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Network: http://192.168.1.40:${PORT}`);
    console.log(`\nTo access from mobile on same WiFi, use: http://192.168.1.40:${PORT}`);
});