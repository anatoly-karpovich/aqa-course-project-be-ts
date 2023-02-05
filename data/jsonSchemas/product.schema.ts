import { AllowedSchema } from "express-json-validator-middleware";

export const productSchema: AllowedSchema = {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        amount: { type: "integer" },
        price: { type: "integer" },
        manufacturer: { type: "string" },
        notes: { type: "string" },
      },
      required: ["name", "amount", "price", "manufacturer"],
    };