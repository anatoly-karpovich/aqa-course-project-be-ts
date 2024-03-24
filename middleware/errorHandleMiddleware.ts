import { NextFunction, Response, Request } from "express";
import { ValidationError } from "express-json-validator-middleware";
import { VALIDATION_ERROR_MESSAGES } from "../data/enums";

export function errorHandleMiddleware(error, req: Request, res: Response, next: NextFunction) {
  // Check the error is a validation error
  if (error instanceof ValidationError) {
    // Handle the error
    res.status(400).send({
      IsSuccess: false,
      ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY,
      SchemaErrors: error.validationErrors.body,
    });
    next();
  } else {
    // Pass error on if not a validation error
    next(error);
  }
}
