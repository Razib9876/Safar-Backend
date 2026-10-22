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
const booking_validation_2 = require("./booking.validation");
const driver_validation_1 = require("../driver/driver.validation");
const router = (0, express_1.Router)();
router.patch("/:id/confirm-booking/:quoteId", (0, booking_validation_2.idParamRules)(), (0, booking_validation_2.quoteIdParamRules)(), booking_validation_2.validate, bookingController.confirmBookingWithDriver);
router.post("/create", (0, booking_validation_2.createBookingRules)(), booking_validation_2.validate, bookingController.create);
router.get("/", bookingController.list);
router.get("/available-for-driver", bookingController.listAvailableForDriver);
router.post("/:id/driver-quote", (0, booking_validation_2.idParamRules)(), (0, booking_validation_2.addQuoteRules)(), booking_validation_2.validate, bookingController.sendDriverQuote);
router.get("/:id/driver-quotes", (0, booking_validation_2.idParamRules)(), booking_validation_2.validate, bookingController.getDriverQuotesByBookingId);
router.get("/completed", bookingController.listCompleted);
router.get("/pending", bookingController.listPending);
router.get("/rejected", bookingController.getRejectedBookings);
router.get("/user/:userId", bookingController.getBookingsByUser);
router.get("/by-email", bookingController.getBookingsByUserEmail);
router.get("/:id", (0, booking_validation_2.idParamRules)(), booking_validation_2.validate, bookingController.getById);
router.patch("/:id", (0, booking_validation_2.updateBookingRules)(), booking_validation_2.validate, bookingController.update);
router.get("/user/:userId/pending-quotes", bookingController.listUserPendingQuoteBookings);
router.get("/driver-quotes/:driverId", (0, booking_validation_1.driverIdParamRules)(), booking_validation_2.validate, bookingController.getDriverQuotesByDriverId);
router.patch("/to-public/:id", (0, booking_validation_2.idParamRules)(), booking_validation_2.validate, bookingController.makePublic);
router.patch("/to-public/:id", bookingController.updateBookingStatus);
router.patch("/to-assined-by-admin/:id", (0, booking_validation_2.idParamRules)(), bookingController.makeQuotedWithDriver);
router.patch("/to-rejected/:id", (0, booking_validation_2.idParamRules)(), booking_validation_2.validate, bookingController.makeRejected);
// Cancel booking
router.post("/cancel/:bookingId", bookingController.cancelBooking);
router.post("/:id/quotes", (0, booking_validation_2.idParamRules)(), (0, booking_validation_2.addQuoteRules)(), booking_validation_2.validate, bookingController.addQuote);
router.patch("/:id/quotes/:quoteId/reject", (0, booking_validation_2.idParamRules)(), (0, booking_validation_2.quoteIdParamRules)(), booking_validation_2.validate, bookingController.rejectQuote);
router.patch("/:id/select-quote", (0, booking_validation_2.idParamRules)(), (0, booking_validation_2.selectQuoteBodyRules)(), booking_validation_2.validate, bookingController.selectQuote);
// GET confirmed & paid bookings for a driver
router.get("/driver/:driverId/confirmed-bookings", (0, booking_validation_1.driverIdParamRules)(), booking_validation_2.validate, bookingController.getDriverConfirmedBookings);
router.post("/:id/complete", (0, booking_validation_2.idParamRules)(), booking_validation_2.validate, bookingController.complete);
// PATCH /bookings/:bookingId/drop-off
router.patch("/:bookingId/drop-off", (0, driver_validation_1.bookingIdParamRules)(), booking_validation_2.validate, bookingController.dropOffBooking);
router.patch("/:bookingId/verify-completion-otp", (0, driver_validation_1.bookingIdParamRules)(), booking_validation_2.validate, bookingController.verifyCompletionOtp);
router.get("/driver/:driverId/completed-bookings", (0, booking_validation_1.driverIdParamRules)(), booking_validation_2.validate, bookingController.getDriverCompletedBookings);
router.patch("/:id/cancel", (0, booking_validation_2.idParamRules)(), booking_validation_2.validate, bookingController.cancel);
exports.default = router;
//# sourceMappingURL=booking.router.js.map