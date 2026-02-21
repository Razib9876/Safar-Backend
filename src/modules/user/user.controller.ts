import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as userService from "./user.service";
import { ApiError } from "../../utils/ApiError";
import { IUserCreate, IUserUpdate } from "./user.interface";

export const getByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.params;
    const createIfMissing = req.query.create === "true";
    let user = await userService.findUserByEmail(email);
    if (!user && createIfMissing) {
      const body = req.body as IUserCreate;
      user = await userService.getOrCreateByEmail({
        email,
        name: body?.name || email.split("@")[0],
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
    const id = new Types.ObjectId(req.params.id);
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
    const role = req.query.role as string | undefined;
    const status = req.query.status as string | undefined;
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
    const id = new Types.ObjectId(req.params.id);
    const data = req.body as IUserUpdate;
    const user = await userService.updateUser(id, data);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
};
