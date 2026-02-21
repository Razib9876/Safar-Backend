import express from "express";
import cors from "cors";
import userRouter from "./modules/user/user.router";
import driverRouter from "./modules/driver/driver.router";
import bookingRouter from "./modules/booking/booking.router";
import paymentRoutes from "./modules/payment/payment.router";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/error.middleware";
import { optionalAuth } from "./middleware/auth.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "https://vercel.com/razib9876s-projects/safarapp/3ma5yiUn4KGn1g457GTeMD79314J",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Safar API is running" });
});

app.use("/api/users", userRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRoutes);

app.use(errorHandler);

export default app;
