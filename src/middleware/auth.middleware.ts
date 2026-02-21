import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { IAuthUser } from '../types/express';
import { Types } from 'mongoose';
import { User } from '../modules/user/user.model';

/**
 * Placeholder auth: no Firebase/JWT yet.
 * For development you can pass ?asUser=userId in query or use x-user-id header
 * to simulate logged-in user. Later replace with real token verification.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const headerUserId = req.headers['x-user-id'] as string | undefined;
    const queryUserId = req.query.asUser as string | undefined;
    const userId = headerUserId || queryUserId;
    if (userId && Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId).select('_id email role');
      if (user) {
        (req as Request & { user: IAuthUser }).user = {
          _id: user._id as Types.ObjectId,
          email: user.email,
          role: user.role,
        };
      }
    }
    next();
  } catch (e) {
    next(e);
  }
};

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(new ApiError(401, 'Authentication required'));
    return;
  }
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, 'Forbidden'));
      return;
    }
    next();
  };
};
