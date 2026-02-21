"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateById = exports.list = exports.getById = exports.updateMe = exports.getMe = exports.getByEmail = void 0;
const mongoose_1 = require("mongoose");
const userService = __importStar(require("./user.service"));
const ApiError_1 = require("../../utils/ApiError");
const getByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const createIfMissing = req.query.create === 'true';
        let user = await userService.findUserByEmail(email);
        if (!user && createIfMissing) {
            const body = req.body;
            user = await userService.getOrCreateByEmail({
                email,
                name: body?.name || email.split('@')[0],
                phone: body?.phone,
                role: body?.role || 'rider',
                photoURL: body?.photoURL,
            });
        }
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (e) {
        next(e);
    }
};
exports.getByEmail = getByEmail;
const getMe = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId)
            throw new ApiError_1.ApiError(401, 'Unauthorized');
        const user = await userService.findUserById(userId);
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        res.status(200).json({ success: true, data: user });
    }
    catch (e) {
        next(e);
    }
};
exports.getMe = getMe;
const updateMe = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId)
            throw new ApiError_1.ApiError(401, 'Unauthorized');
        const data = req.body;
        const user = await userService.updateUser(userId, data);
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        res.status(200).json({ success: true, data: user });
    }
    catch (e) {
        next(e);
    }
};
exports.updateMe = updateMe;
const getById = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const user = await userService.findUserById(id);
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        res.status(200).json({ success: true, data: user });
    }
    catch (e) {
        next(e);
    }
};
exports.getById = getById;
const list = async (req, res, next) => {
    try {
        const role = req.query.role;
        const status = req.query.status;
        const users = await userService.listUsers({ role, status });
        res.status(200).json({ success: true, data: users });
    }
    catch (e) {
        next(e);
    }
};
exports.list = list;
const updateById = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const data = req.body;
        const user = await userService.updateUser(id, data);
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        res.status(200).json({ success: true, data: user });
    }
    catch (e) {
        next(e);
    }
};
exports.updateById = updateById;
//# sourceMappingURL=user.controller.js.map