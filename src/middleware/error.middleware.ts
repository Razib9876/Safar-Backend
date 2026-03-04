import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  console.error(err);
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : (err as Error).message;
  res.status(500).json({
    success: false,
    message,
  });
};
