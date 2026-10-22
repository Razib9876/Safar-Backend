"use strict";
// import express from "express";
// import cors from "cors";
// import userRouter from "./modules/user/user.router";
// import driverRouter from "./modules/driver/driver.router";
// import bookingRouter from "./modules/booking/booking.router";
// import paymentRoutes from "./modules/payment/payment.router";
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { errorHandler } from "./middleware/error.middleware";
// const app = express();
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   }),
// );
// app.use(express.json());
// app.get("/", (_req, res) => {
//   res.json({ success: true, message: "Safar API is running" });
// });
// app.use("/api/users", userRouter);
// app.use("/api/drivers", driverRouter);
// app.use("/api/bookings", bookingRouter);
// app.use("/api/payments", paymentRoutes);
// app.use(errorHandler);
// export default app;
// import express from "express";
// import cors from "cors";
// import userRouter from "./modules/user/user.router";
// import driverRouter from "./modules/driver/driver.router";
// import bookingRouter from "./modules/booking/booking.router";
// import paymentRoutes from "./modules/payment/payment.router";
// import dotenv from "dotenv";
// import { errorHandler } from "./middleware/error.middleware";
// dotenv.config();
// const app = express();
// Better CORS setup
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (mobile apps, curl)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = `CORS policy: The origin ${origin} is not allowed.`;
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//     credentials: true,
//   }),
// );
// // Handle all preflight OPTIONS requests
// app.options("*", cors());
// app.use(express.json());
// // Routes
// app.get("/", (_req, res) => {
//   res.json({ success: true, message: "Safar API is running" });
// });
// app.use("/api/users", userRouter);
// app.use("/api/drivers", driverRouter);
// app.use("/api/bookings", bookingRouter);
// app.use("/api/payments", paymentRoutes);
// app.use(errorHandler);
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_router_1 = __importDefault(require("./modules/user/user.router"));
const driver_router_1 = __importDefault(require("./modules/driver/driver.router"));
const booking_router_1 = __importDefault(require("./modules/booking/booking.router"));
const payment_router_1 = __importDefault(require("./modules/payment/payment.router"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Define allowed origins first
const allowedOrigins = [
    "http://localhost:5173", // local dev
    "https://safarapps.netlify.app", // deployed frontend
    "https://hoppscotch.io", // Hoppscotch
];
// CORS fix
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
// Test route
app.get("/", (_req, res) => {
    res.json({ success: true, message: "Safar API is running" });
});
// Routes
app.use("/api/users", user_router_1.default);
app.use("/api/drivers", driver_router_1.default);
app.use("/api/bookings", booking_router_1.default);
app.use("/api/payments", payment_router_1.default);
// Global error handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map