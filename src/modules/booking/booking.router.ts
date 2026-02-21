import { Router } from "express";
import * as bookingController from "./booking.controller";
import { driverIdParamRules } from "./booking.validation";
import {
  createBookingRules,
  updateBookingRules,
  addQuoteRules,
  selectQuoteBodyRules,
  verifyOtpBodyRules,
  idParamRules,
  quoteIdParamRules,
  validate,
} from "./booking.validation";

const router = Router();
router.patch(
  "/:id/confirm-booking/:quoteId",
  idParamRules(),
  quoteIdParamRules(),
  validate,
  bookingController.confirmBookingWithDriver,
);
router.post(
  "/create",
  createBookingRules(),
  validate,
  bookingController.create,
);
router.get("/", bookingController.list);

router.get("/available-for-driver", bookingController.listAvailableForDriver);
router.post(
  "/:id/driver-quote",
  idParamRules(),
  addQuoteRules(),
  validate,
  bookingController.sendDriverQuote,
);
router.get(
  "/:id/driver-quotes",
  idParamRules(),
  validate,
  bookingController.getDriverQuotesByBookingId,
);
router.get("/completed", bookingController.listCompleted);
router.get("/pending", bookingController.listPending);
router.get("/rejected", bookingController.getRejectedBookings);

router.get("/user/:userId", bookingController.getBookingsByUser);

router.get("/by-email", bookingController.getBookingsByUserEmail);

router.get("/:id", idParamRules(), validate, bookingController.getById);
router.patch("/:id", updateBookingRules(), validate, bookingController.update);
router.get(
  "/user/:userId/pending-quotes",
  bookingController.listUserPendingQuoteBookings,
);
router.get(
  "/driver-quotes/:driverId",
  driverIdParamRules(),
  validate,
  bookingController.getDriverQuotesByDriverId,
);
router.patch(
  "/to-public/:id",
  idParamRules(),
  validate,
  bookingController.makePublic,
);

router.patch("/to-public/:id", bookingController.updateBookingStatus);
router.patch(
  "/to-assined-by-admin/:id",
  idParamRules(),
  bookingController.makeQuotedWithDriver,
);

router.patch(
  "/to-rejected/:id",
  idParamRules(),
  validate,
  bookingController.makeRejected,
);

router.post(
  "/:id/quotes",
  idParamRules(),
  addQuoteRules(),
  validate,
  bookingController.addQuote,
);
router.patch(
  "/:id/quotes/:quoteId/reject",
  idParamRules(),
  quoteIdParamRules(),
  validate,
  bookingController.rejectQuote,
);
router.patch(
  "/:id/select-quote",
  idParamRules(),
  selectQuoteBodyRules(),
  validate,
  bookingController.selectQuote,
);
router.post(
  "/:id/complete",
  idParamRules(),
  validate,
  bookingController.complete,
);
router.post(
  "/:id/verify-otp",
  idParamRules(),
  verifyOtpBodyRules(),
  validate,
  bookingController.verifyOtp,
);
router.patch("/:id/cancel", idParamRules(), validate, bookingController.cancel);

export default router;
