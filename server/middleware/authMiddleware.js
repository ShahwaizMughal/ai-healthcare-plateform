import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect middleware — verifies the JWT from the Authorization header.
 * Attaches the authenticated user to req.user for downstream controllers.
 * Usage: router.get('/me', protect, getCurrentUser)
 */
export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check that a Bearer token was sent
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided. Please log in.' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token signature and expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from DB (excluding password) and attach to request
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found. Token is invalid.' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is disabled. Please contact support.' });
        }

        req.user = user;
        next();

    } catch (error) {
        // jwt.verify throws if token is expired or tampered
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};