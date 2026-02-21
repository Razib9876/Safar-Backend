import mongoose from 'mongoose';
import { IUserDoc } from './user.interface';
export declare const User: mongoose.Model<IUserDoc, {}, {}, {}, mongoose.Document<unknown, {}, IUserDoc, {}, {}> & IUserDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.model.d.ts.map