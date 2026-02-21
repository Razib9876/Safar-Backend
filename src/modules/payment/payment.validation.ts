import { body } from "express-validator";

export const initiatePaymentValidation = [
  body("bookingId").notEmpty().withMessage("Booking ID is required"),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("paymentMethod")
    .isIn([
      "bkash",
      "nagad",
      "rocket",
      "upay",
      "tap",
      "surecash",
      "visa",
      "mastercard",
      "amex",
      "unionpay",
      "dbbl_nexus",
      "maestro",
      "cash",
      "internet_banking",
    ])
    .withMessage("Invalid payment method"),
];
