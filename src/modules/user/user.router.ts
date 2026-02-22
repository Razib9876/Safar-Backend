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
router.patch(
  "/me",
  firebaseAuth,
  updateUserRules(),
  validate,
  userController.updateMe,
);

// Admin-only routes
router.get("/", firebaseAuth, requireRole("admin"), userController.list);
router.get("/:id", firebaseAuth, requireRole("admin"), userController.getById);
router.patch(
  "/:id",
  firebaseAuth,
  requireRole("admin"),
  updateUserRules(),
  validate,
  userController.updateById,
);

export default router;
