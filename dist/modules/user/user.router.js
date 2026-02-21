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
const express_1 = require("express");
const userController = __importStar(require("./user.controller"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
// GET /api/users/by-email/:email?create=true + optional body for create
router.get('/by-email/:email', (0, user_validation_1.getByEmailRules)(), user_validation_1.validate, userController.getByEmail);
// GET /api/users/me (requires auth middleware later)
router.get('/me', userController.getMe);
router.patch('/me', (0, user_validation_1.updateUserRules)(), user_validation_1.validate, userController.updateMe);
// GET /api/users, GET /api/users/:id, PATCH /api/users/:id (admin later)
router.get('/', userController.list);
router.get('/:id', userController.getById);
router.patch('/:id', (0, user_validation_1.updateUserRules)(), user_validation_1.validate, userController.updateById);
exports.default = router;
//# sourceMappingURL=user.router.js.map