const jwt = require('jsonwebtoken');

/**
 * Generates a JWT access token for a given user ID.
 * Token expires in 7 days (stored in localStorage on frontend).
 * @param {string} id - MongoDB user _id
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = generateToken;