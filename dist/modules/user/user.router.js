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
const firebaseAuth_middleware_1 = require("../../middleware/firebaseAuth.middleware");
const roleAuth_1 = require("../../middleware/roleAuth");
const router = (0, express_1.Router)();
// Public route
router.get("/by-email/:email", (0, user_validation_1.getByEmailRules)(), user_validation_1.validate, userController.getByEmail);
// Protected routes
router.get("/me", firebaseAuth_middleware_1.firebaseAuth, userController.getMe);
// user.router.ts
router.get("/public", userController.list); // no firebaseAuth, no role check
router.patch("/me", firebaseAuth_middleware_1.firebaseAuth, (0, user_validation_1.updateUserRules)(), user_validation_1.validate, userController.updateMe);
// Admin-only routes
router.get("/", userController.list);
router.get("/:id", firebaseAuth_middleware_1.firebaseAuth, (0, roleAuth_1.requireRole)("admin"), userController.getById);
// Admin role management
router.patch("/:id/promote-admin", firebaseAuth_middleware_1.firebaseAuth, (0, roleAuth_1.requireRole)("admin"), userController.promoteToAdmin);
router.patch("/:id/demote-user", firebaseAuth_middleware_1.firebaseAuth, (0, roleAuth_1.requireRole)("admin"), userController.demoteToUser);
router.patch("/:id", firebaseAuth_middleware_1.firebaseAuth, (0, roleAuth_1.requireRole)("admin"), (0, user_validation_1.updateUserRules)(), user_validation_1.validate, userController.updateById);
exports.default = router;
//# sourceMappingURL=user.router.js.map