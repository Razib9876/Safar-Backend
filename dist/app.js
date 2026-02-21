"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = __importDefault(require("./modules/user/user.router"));
const driver_router_1 = __importDefault(require("./modules/driver/driver.router"));
const booking_router_1 = __importDefault(require("./modules/booking/booking.router"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_middleware_1.optionalAuth);
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Safar API is running' });
});
app.use('/api/users', user_router_1.default);
app.use('/api/drivers', driver_router_1.default);
app.use('/api/bookings', booking_router_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map