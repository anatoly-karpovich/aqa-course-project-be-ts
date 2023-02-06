import { Validator } from "express-json-validator-middleware";
import * as schemas from "../data/jsonSchemas";

type Schemas = keyof typeof schemas;

const { validate } = new Validator({ allErrors: true });

export function schemaMiddleware(schema: Schemas) {
  return validate({ body: schemas[schema] });
}


