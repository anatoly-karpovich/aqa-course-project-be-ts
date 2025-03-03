import { AllowedSchema } from "express-json-validator-middleware";
import { COUNTRIES } from "../enums";

export const customerSchema: AllowedSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    name: { type: "string" },
    country: { type: "string", enum: Object.values(COUNTRIES) },
    city: { type: "string" },
    street: { type: "string" },
    house: { type: "integer" },
    flat: { type: "integer" },
    phone: { type: "string" },
    notes: { type: "string" },
  },
  required: ["email", "name", "country", "city", "street", "house", "flat", "phone"],
};
