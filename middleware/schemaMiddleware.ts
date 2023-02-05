import { NextFunction, Request, Response } from "express";
import { ValidationError, Validator } from "express-json-validator-middleware";
import * as schemas from "../data/jsonSchemas"

type Schemas = keyof typeof schemas

const { validate } = new Validator({allErrors: true});

export function schemaMiddleware(schema: Schemas) {
    return  validate({ body: schemas[schema] })
}

export function errorHandling(error, req: Request, res: Response, next: NextFunction) {
    // Check the error is a validation error
    if (error instanceof ValidationError) {
      // Handle the error
      res.status(400).send({
        isSuccess: false,
        ErrorMessage: 'Incorrect request body',
        SchemaErrors: error.validationErrors.body
    });
      next();
    } else {
      // Pass error on if not a validation error
      next(error);
    }
  }