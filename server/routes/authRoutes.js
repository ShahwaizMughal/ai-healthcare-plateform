import express from 'express';
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─────────────────────────────────────────────
// Public routes — no authentication required
// ─────────────────────────────────────────────

// POST /api/auth/signup — Register a new patient account
router.post('/signup', registerUser);

// POST /api/auth/login — Login with email + password
router.post('/login', loginUser);

// POST /api/auth/forgot-password — Request a password reset email
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password/:token — Submit new password with the token from email
router.post('/reset-password/:token', resetPassword);

// ─────────────────────────────────────────────
// Protected routes — require valid JWT
// ─────────────────────────────────────────────

// GET /api/auth/me — Get currently logged-in user's profile (used for session restore)
router.get('/me', protect, getCurrentUser);

// POST /api/auth/logout — Logout (frontend clears localStorage; this confirms server-side)
router.post('/logout', protect, logoutUser);

export default router;