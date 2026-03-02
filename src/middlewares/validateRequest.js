import { validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const details = errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  return sendError(res, 400, "Validation failed", details);
};
