import { AllowedSchema } from "express-json-validator-middleware";

export const customerSchema: AllowedSchema = {
      type: "object",
      properties: {
        _id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        country: { type: "string" },
        city: { type: "string" },
        street: { type: "string" },
        house: { type: "integer" },
        flat: { type: "integer" },
        phone: { type: "string" },
        notes: { type: "string" },
      },
      required: ["email", "name", "country", "city", "street", "house", "flat", "phone"],
    };
