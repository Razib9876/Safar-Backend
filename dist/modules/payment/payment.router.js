"use strict";
// import express from "express";
// import { initiatePaymentValidation } from "./payment.validation";
// import { initiatePayment } from "./payment.controller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.post("/initiate", initiatePaymentValidation, initiatePayment);
// export default router;
const express_1 = __importDefault(require("express"));
const payment_validation_1 = require("./payment.validation");
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/initiate", payment_validation_1.initiatePaymentValidation, payment_controller_1.initiatePayment);
exports.default = router;
//# sourceMappingURL=payment.router.js.map