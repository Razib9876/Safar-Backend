import { Request, Response, NextFunction } from 'express';
export declare const createBookingRules: () => import("express-validator").ValidationChain[];
export declare const updateBookingRules: () => import("express-validator").ValidationChain[];
export declare const addQuoteRules: () => import("express-validator").ValidationChain[];
export declare const selectQuoteBodyRules: () => import("express-validator").ValidationChain[];
export declare const verifyOtpBodyRules: () => import("express-validator").ValidationChain[];
export declare const idParamRules: () => import("express-validator").ValidationChain[];
export declare const quoteIdParamRules: () => import("express-validator").ValidationChain[];
export declare const validate: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=booking.validation.d.ts.map