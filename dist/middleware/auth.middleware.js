"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = exports.optionalAuth = void 0;
const ApiError_1 = require("../utils/ApiError");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../modules/user/user.model");
/**
 * Placeholder auth: no Firebase/JWT yet.
 * For development you can pass ?asUser=userId in query or use x-user-id header
 * to simulate logged-in user. Later replace with real token verification.
 */
const optionalAuth = async (req, _res, next) => {
    try {
        const headerUserId = req.headers['x-user-id'];
        const queryUserId = req.query.asUser;
        const userId = headerUserId || queryUserId;
        if (userId && mongoose_1.Types.ObjectId.isValid(userId)) {
            const user = await user_model_1.User.findById(userId).select('_id email role');
            if (user) {
                req.user = {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                };
            }
        }
        next();
    }
    catch (e) {
        next(e);
    }
};
exports.optionalAuth = optionalAuth;
const requireAuth = (req, _res, next) => {
    if (!req.user) {
        next(new ApiError_1.ApiError(401, 'Authentication required'));
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new ApiError_1.ApiError(401, 'Authentication required'));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new ApiError_1.ApiError(403, 'Forbidden'));
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.middleware.js.map