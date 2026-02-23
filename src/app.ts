// import express from "express";
// import cors from "cors";
// import userRouter from "./modules/user/user.router";
// import driverRouter from "./modules/driver/driver.router";
// import bookingRouter from "./modules/booking/booking.router";
// import paymentRoutes from "./modules/payment/payment.router";
// import dotenv from "dotenv";

// import { errorHandler } from "./middleware/error.middleware";

// const app = express();

// app.use(
//   cors({
//     origin: ["https://safarapp.vercel.app"],
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

import express from "express";
import cors from "cors";
import userRouter from "./modules/user/user.router";
import driverRouter from "./modules/driver/driver.router";
import bookingRouter from "./modules/booking/booking.router";
import paymentRoutes from "./modules/payment/payment.router";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

// CORS config
app.use(
  cors({
    origin: ["https://safarapp.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow preflight
    allowedHeaders: ["Content-Type", "Authorization"], // allow auth header
  }),
);

// Handle preflight OPTIONS requests
app.options("*", cors()); // this enables CORS for all routes/options requests

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
