import { Router } from "express";
import * as userController from "./user.controller";
import {
  createUserRules,
  updateUserRules,
  getByEmailRules,
  validate,
} from "./user.validation";
import { firebaseAuth } from "../../middleware/firebaseAuth.middleware";
import { requireRole } from "../../middleware/roleAuth";

const router = Router();

// Public route
router.get(
  "/by-email/:email",
  getByEmailRules(),
  validate,
  userController.getByEmail,
);

// Protected routes
router.get("/me", firebaseAuth, userController.getMe);
// user.router.ts
router.get("/public", userController.list); // no firebaseAuth, no role check
router.patch(
  "/me",
  firebaseAuth,
  updateUserRules(),
  validate,
  userController.updateMe,
);

// Admin-only routes
router.get("/", userController.list);
router.get("/:id", firebaseAuth, requireRole("admin"), userController.getById);

// Admin role management
router.patch(
  "/:id/promote-admin",
  // firebaseAuth,
  // requireRole("admin"),
  userController.promoteToAdmin,
);

router.patch(
  "/:id/demote-user",
  // firebaseAuth,
  // requireRole("admin"),
  userController.demoteToUser,
);
router.patch(
  "/:id",
  firebaseAuth,
  requireRole("admin"),
  updateUserRules(),
  validate,
  userController.updateById,
);

export default router;
