import mongoose from 'mongoose';
import { IDriverDoc } from './driver.interface';
export declare const Driver: mongoose.Model<IDriverDoc, {}, {}, {}, mongoose.Document<unknown, {}, IDriverDoc, {}, {}> & IDriverDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=driver.model.d.ts.map