import { Router } from "express";
import * as userController from "./user.controller";
import {
  createUserRules,
  updateUserRules,
  getByEmailRules,
  validate,
} from "./user.validation";
import { firebaseAuth } from "../../middleware/firebaseAuth.middleware";

const router = Router();

router.get(
  "/by-email/:email",
  getByEmailRules(),
  validate,
  userController.getByEmail,
);

router.get("/me", firebaseAuth, userController.getMe);
router.patch("/me", updateUserRules(), validate, userController.updateMe);

router.get("/", userController.list);
router.get("/:id", userController.getById);
router.patch("/:id", updateUserRules(), validate, userController.updateById);

export default router;
