import { Request, Response, NextFunction } from "express";
/**
 * Role-based access
 * Usage: requireRole("admin", "moderator")
 */
export declare const requireRole: (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleAuth.d.ts.map