import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PaymentService } from "./payment.service";

export const initiatePayment = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const result = await PaymentService.initiatePayment(req.body);

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: result,
    });
  } catch (err: any) {
    if (err.code === "ALREADY_PAID" || err.message === "Booking already paid") {
      return res.status(400).json({
        success: false,
        message: "Booking already paid",
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
