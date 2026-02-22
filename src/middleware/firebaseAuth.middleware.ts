// middleware/firebaseAuth.ts
import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseAdmin";
import { User } from "../modules/user/user.model";
import { ApiError } from "../utils/ApiError";

export const firebaseAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email) return next(new ApiError(401, "Invalid token"));

    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await User.create({
        email: decoded.email,
        name: decoded.email.split("@")[0],
        role: "rider",
        status: "active",
      });
    }

    req.user = { _id: user._id, email: user.email, role: user.role };
    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err);
    next(new ApiError(401, "Unauthorized"));
  }
};
