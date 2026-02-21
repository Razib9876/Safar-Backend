import { Types } from 'mongoose';

export interface IAuthUser {
  _id: Types.ObjectId;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

export {};
