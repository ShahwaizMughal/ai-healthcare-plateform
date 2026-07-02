/**
 * isAdmin middleware — must be used AFTER the protect middleware.
 * Verifies that the authenticated user has the 'admin' role.
 * Usage: router.get('/admin/data', protect, isAdmin, adminController)
 */
const isAdmin = (req, res, next) => {
    // req.user is set by the protect middleware that runs before this
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    // 403 Forbidden — authenticated but not authorized (SRS Section 10.13)
    return res.status(403).json({
        message: 'Access denied. Admin privileges required.',
    });
};

module.exports = { isAdmin };
