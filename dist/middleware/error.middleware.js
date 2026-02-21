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
    res.status(500).json({ success: false, message: 'Internal server error' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map