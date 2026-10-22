"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }
    console.error(err);
    const message = process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message;
    res.status(500).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map