"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * Role-based access
 * Usage: requireRole("admin", "moderator")
 */
const requireRole = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new ApiError_1.ApiError(401, "Authentication required"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(403, "Forbidden"));
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=roleAuth.js.map