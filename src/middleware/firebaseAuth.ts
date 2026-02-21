import { Request, Response, NextFunction } from "express";
import { User } from "../modules/user/user.model";
import admin from "../config/firebaseAdmin";

export const firebaseAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;

    // Mongo sync
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: email.split("@")[0],
        role: "rider",
        status: "active",
      });
    }

    req.user = { _id: user._id, email: user.email, role: user.role } as any;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
