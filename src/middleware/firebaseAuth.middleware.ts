import { Request, Response, NextFunction } from "express";
import { User } from "../modules/user/user.model";
import { ApiError } from "../utils/ApiError";
import admin from "../config/firebaseAdmin";

export const firebaseAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "No token provided"));
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    // Find Mongo user
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return next(new ApiError(401, "User not registered"));
    }

    // Attach to req
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err);
    next(new ApiError(401, "Invalid token"));
  }
};
