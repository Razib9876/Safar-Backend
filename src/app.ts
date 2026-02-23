import express from "express";
import cors from "cors";
import userRouter from "./modules/user/user.router";
import driverRouter from "./modules/driver/driver.router";
import bookingRouter from "./modules/booking/booking.router";
import paymentRoutes from "./modules/payment/payment.router";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Safar API is running" });
});

app.use("/api/users", userRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRoutes);

app.use(errorHandler);

export default app;
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
