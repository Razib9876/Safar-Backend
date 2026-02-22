import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as userService from "./user.service";
import { ApiError } from "../../utils/ApiError";
import { IUserCreate, IUserUpdate, UserRole } from "./user.interface";

export const getByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Ensure email is a single string
    const paramEmail = req.params.email;
    if (!paramEmail || Array.isArray(paramEmail)) {
      throw new ApiError(400, "Invalid email parameter");
    }
    const email: string = paramEmail;

    // Ensure query param is string
    const createIfMissing = req.query.create === "true";

    let user = await userService.findUserByEmail(email);

    if (!user && createIfMissing) {
      const body = req.body as IUserCreate;

      // Use email safely
      const username = email.includes("@") ? email.split("@")[0] : email;

      user = await userService.getOrCreateByEmail({
        email,
        name: body?.name || username,
        phone: body?.phone,
        role: body?.role || "rider",
        photoURL: body?.photoURL,
      });
    }

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized");
    const user = await userService.findUserById(userId);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized");
    const data = req.body as IUserUpdate;
    const user = await userService.updateUser(userId, data);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const paramId = req.params.id;

    // Ensure ID is a single string
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    const id = new Types.ObjectId(paramId);

    const user = await userService.findUserById(id);
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Ensure query params are strings
    const roleQuery = req.query.role;
    const statusQuery = req.query.status;

    // Only allow role if it matches UserRole enum/type
    const role =
      typeof roleQuery === "string" ? (roleQuery as UserRole) : undefined;
    const status = typeof statusQuery === "string" ? statusQuery : undefined;

    const users = await userService.listUsers({ role, status });
    res.status(200).json({ success: true, data: users });
  } catch (e) {
    next(e);
  }
};
export const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const paramId = req.params.id;
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    const id = new Types.ObjectId(paramId);

    const data = req.body as IUserUpdate;
    const user = await userService.updateUser(id, data);
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};
