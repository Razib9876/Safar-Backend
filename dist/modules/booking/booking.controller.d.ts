import { Request, Response, NextFunction } from 'express';
export declare const create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addQuote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rejectQuote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const selectQuote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const complete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancel: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=booking.controller.d.ts.map