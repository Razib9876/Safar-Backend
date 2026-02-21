import { Request, Response, NextFunction } from 'express';
/**
 * Placeholder auth: no Firebase/JWT yet.
 * For development you can pass ?asUser=userId in query or use x-user-id header
 * to simulate logged-in user. Later replace with real token verification.
 */
export declare const optionalAuth: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const requireAuth: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireRole: (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map