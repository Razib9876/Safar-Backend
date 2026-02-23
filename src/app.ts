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

dotenv.config();

const app = express();

// Better CORS setup
app.use(
  cors({
    origin: "https://safarapp.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Handle preflight OPTIONS requests globally
app.options(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());

// Routes
app.get("/", (_req, res) => {
  res.json({ success: true, message: "Safar API is running" });
});

app.use("/api/users", userRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRoutes);

app.use(errorHandler);

export default app;
