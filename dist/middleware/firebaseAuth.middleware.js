"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuth = void 0;
const firebaseAdmin_1 = __importDefault(require("../config/firebaseAdmin"));
const user_model_1 = require("../modules/user/user.model");
const ApiError_1 = require("../utils/ApiError");
const firebaseAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ApiError_1.ApiError(401, "No token provided"));
        }
        const token = authHeader.split(" ")[1];
        const decoded = await firebaseAdmin_1.default.auth().verifyIdToken(token);
        if (!decoded.email)
            return next(new ApiError_1.ApiError(401, "Invalid token"));
        let user = await user_model_1.User.findOne({ email: decoded.email });
        if (!user) {
            user = await user_model_1.User.create({
                email: decoded.email,
                name: decoded.email.split("@")[0],
                role: "rider",
                status: "active",
            });
        }
        req.user = { _id: user._id, email: user.email, role: user.role };
        next();
    }
    catch (err) {
        console.error("Firebase Auth Error:", err);
        next(new ApiError_1.ApiError(401, "Unauthorized"));
    }
};
exports.firebaseAuth = firebaseAuth;
//# sourceMappingURL=firebaseAuth.middleware.js.map