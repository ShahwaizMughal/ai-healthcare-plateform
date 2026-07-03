const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// ─────────────────────────────────────────────
// POST /api/auth/signup
// Register a new patient account (auto-login after signup)
// ─────────────────────────────────────────────
const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // Basic validation
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists (SRS: 409 for duplicate email)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        // Hash password manually before database insertion
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({ fullName, email, phone, password: hashedPassword });

        // Auto-login: issue JWT immediately (SRS Section 3.1.2 Inferred Requirement)
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            message: 'Account created successfully',
        });

    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// ─────────────────────────────────────────────
// POST /api/auth/login
// Authenticate user with email + password
// ─────────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Must use .select('+password') because password has select: false in schema
        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.isActive) {
            // Generic message — don't leak whether the email exists (SRS Section 3.1.3)
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare entered password with bcrypt hash using model method
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            message: 'Login successful',
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// ─────────────────────────────────────────────
// GET /api/auth/me  (requires auth middleware)
// Returns the currently authenticated user's profile
// Used on every app load to restore session (SRS Section 5.1)
// ─────────────────────────────────────────────
const getCurrentUser = async (req, res) => {
    try {
        // req.user is set by the protect middleware (excludes password)
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        console.error('Get current user error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// ─────────────────────────────────────────────
// POST /api/auth/logout  (requires auth middleware)
// Logout — frontend should clear the localStorage token.
// This endpoint exists so we can invalidate server-side state in the future.
// ─────────────────────────────────────────────
const logoutUser = async (req, res) => {
    try {
        // With localStorage-based JWT, logout is handled on the frontend.
        // This endpoint confirms the action and allows future server-side cleanup.
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// ─────────────────────────────────────────────
// POST /api/auth/forgot-password
// Step 1: Generate reset token and email it to the user (SRS Section 3.1.4)
// ─────────────────────────────────────────────
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Always return a generic success message to prevent email enumeration
        // (SRS Section 3.1.4 — 404 is deliberately never returned)
        const genericMessage = 'If that email exists, a reset link has been sent.';

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal that the email doesn't exist
            return res.status(200).json({ success: true, message: genericMessage });
        }

        // Generate a random raw token (sent in email URL)
        const rawToken = crypto.randomBytes(32).toString('hex');

        // Store the SHA-256 hash of the token in DB (so raw token stays secret)
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordTokenHash = tokenHash;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes from now
        await user.save({ validateBeforeSave: false });

        // Build the reset URL that will be embedded in the email
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0E7C86;">Reset Your Password</h2>
                <p>You requested a password reset for your HealthCare Platform account.</p>
                <p>Click the button below to reset your password. This link expires in <strong>30 minutes</strong>.</p>
                <a href="${resetURL}" 
                   style="display: inline-block; background: #0E7C86; color: white; 
                          padding: 12px 24px; border-radius: 8px; text-decoration: none; 
                          font-weight: 600; margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, please ignore this email. Your password will remain unchanged.
                </p>
                <p style="color: #666; font-size: 14px;">
                    Or copy this link: <br />
                    <a href="${resetURL}" style="color: #0E7C86;">${resetURL}</a>
                </p>
            </div>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'HealthCare Platform — Password Reset Link',
                html: emailContent,
            });
        } catch (emailError) {
            // If email sending fails, clear the reset token fields and return an error
            console.error('Email send error:', emailError.message);
            user.resetPasswordTokenHash = null;
            user.resetPasswordExpires = null;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
        }

        res.status(200).json({ success: true, message: genericMessage });

    } catch (error) {
        console.error('Forgot password error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// ─────────────────────────────────────────────
// POST /api/auth/reset-password/:token
// Step 2: Verify token, update password, clear reset fields (SRS Section 3.1.4)
// ─────────────────────────────────────────────
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: 'Password and confirm password are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Hash the raw token from the URL to compare with what's stored in DB
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user whose reset token hash matches and has not expired
        const user = await User.findOne({
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }, // must not be expired
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset link. Please request a new one.',
            });
        }

        // Hash password manually before database update
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the password
        user.password = hashedPassword;
        user.resetPasswordTokenHash = null;  // Invalidate the token (single-use)
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now log in with your new password.',
        });

    } catch (error) {
        console.error('Reset password error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    forgotPassword,
    resetPassword,
};