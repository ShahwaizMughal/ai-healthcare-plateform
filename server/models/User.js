const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        // Full name as required by SRS Section 9.1
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Full name must be at least 2 characters'],
            maxlength: [50, 'Full name cannot exceed 50 characters'],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Phone number: 10-15 digits (SRS Section 9.1)
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },

        // Password is excluded from query results by default (security)
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Never returned in API responses
        },

        // Role controls access: patient (default) or admin
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        profileImage: {
            type: String,
            default: '',
        },

        // Soft-disable accounts without deleting data
        isActive: {
            type: Boolean,
            default: true,
        },

        // Fields used during the Forgot Password flow (SRS Section 3.1.4)
        // Stores a SHA-256 hash of the reset token (raw token is emailed to user)
        resetPasswordTokenHash: {
            type: String,
            default: null,
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Instance method to compare entered password with the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);