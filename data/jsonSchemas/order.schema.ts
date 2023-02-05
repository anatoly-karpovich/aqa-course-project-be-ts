import { AllowedSchema } from "express-json-validator-middleware";

export const orderCreateSchema: AllowedSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    customer: { type: "string" },
    requestedProducts: {
      type: "array",
      items: { type: "string" },
      maxItems: 5,
      minItems: 1,
    },
  },
  required: ["customer", "requestedProducts"],
};
