import { NextFunction, Response, Request } from "express";
import { ValidationError } from "express-json-validator-middleware";

export function errorHandleMiddleware(error, req: Request, res: Response, next: NextFunction) {
    // Check the error is a validation error
    if (error instanceof ValidationError) {
      // Handle the error
      res.status(400).send({
        isSuccess: false,
        ErrorMessage: "Incorrect request body",
        SchemaErrors: error.validationErrors.body,
      });
      next();
    } else {
      // Pass error on if not a validation error
      next(error);
    }
  }