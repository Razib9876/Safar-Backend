import { Request, Response, NextFunction } from "express";
export declare const createDriverRules: () => import("express-validator").ValidationChain[];
export declare const updateDriverRules: () => import("express-validator").ValidationChain[];
export declare const idParamRules: () => import("express-validator").ValidationChain;
export declare const userIdParamRules: () => import("express-validator").ValidationChain;
export declare const driverIdParamRules: () => import("express-validator").ValidationChain;
export declare const bookingIdParamRules: () => import("express-validator").ValidationChain;
export declare const validate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=driver.validation.d.ts.map