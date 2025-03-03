import { AllowedSchema } from "express-json-validator-middleware";
import { MANUFACTURERS } from "../enums";

export const productSchema: AllowedSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    amount: { type: "integer" },
    price: { type: "integer" },
    manufacturer: { type: "string", enum: Object.values(MANUFACTURERS) },
    notes: { type: "string" },
  },
  required: ["name", "amount", "price", "manufacturer"],
};
