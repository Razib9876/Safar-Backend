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
const bookingController = __importStar(require("./booking.controller"));
const booking_validation_1 = require("./booking.validation");
const router = (0, express_1.Router)();
router.post('/', (0, booking_validation_1.createBookingRules)(), booking_validation_1.validate, bookingController.create);
router.get('/', bookingController.list);
router.get('/:id', (0, booking_validation_1.idParamRules)(), booking_validation_1.validate, bookingController.getById);
router.patch('/:id', (0, booking_validation_1.updateBookingRules)(), booking_validation_1.validate, bookingController.update);
router.post('/:id/quotes', (0, booking_validation_1.idParamRules)(), (0, booking_validation_1.addQuoteRules)(), booking_validation_1.validate, bookingController.addQuote);
router.patch('/:id/quotes/:quoteId/reject', (0, booking_validation_1.idParamRules)(), (0, booking_validation_1.quoteIdParamRules)(), booking_validation_1.validate, bookingController.rejectQuote);
router.patch('/:id/select-quote', (0, booking_validation_1.idParamRules)(), (0, booking_validation_1.selectQuoteBodyRules)(), booking_validation_1.validate, bookingController.selectQuote);
router.post('/:id/complete', (0, booking_validation_1.idParamRules)(), booking_validation_1.validate, bookingController.complete);
router.post('/:id/verify-otp', (0, booking_validation_1.idParamRules)(), (0, booking_validation_1.verifyOtpBodyRules)(), booking_validation_1.validate, bookingController.verifyOtp);
router.patch('/:id/cancel', (0, booking_validation_1.idParamRules)(), booking_validation_1.validate, bookingController.cancel);
exports.default = router;
//# sourceMappingURL=booking.router.js.map