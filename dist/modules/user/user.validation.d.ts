import { Request, Response, NextFunction } from 'express';
export declare const createUserRules: () => import("express-validator").ValidationChain[];
export declare const updateUserRules: () => import("express-validator").ValidationChain[];
export declare const getByEmailRules: () => import("express-validator").ValidationChain[];
export declare const validate: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=user.validation.d.ts.map