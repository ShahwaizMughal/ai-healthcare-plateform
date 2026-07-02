const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ─────────────────────────────────────────────
// CORS Configuration
// Allows the React frontend to communicate with this API
// ─────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent (future-proof)
}));

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(express.json());                         // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());                          // Parse cookies

// Static files (for uploaded images, if multer is used by other members)
app.use('/uploads', express.static('uploads'));

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// Health check route — useful for deployment verification
app.get('/', (req, res) => {
    res.json({ message: '✅ HealthCare Platform API is running', status: 'ok' });
});

// ─────────────────────────────────────────────
// 404 Handler — for any unmatched routes (Express v5 syntax)
// ─────────────────────────────────────────────
app.use('/{*path}', (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─────────────────────────────────────────────
// Global Error Handler
// Catches any errors thrown with next(error) pattern
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected server error occurred',
    });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});