import express from "express";
import { initiatePaymentValidation } from "./payment.validation";
import { initiatePayment } from "./payment.controller";

const router = express.Router();

router.post("/initiate", initiatePaymentValidation, initiatePayment);

export default router;
