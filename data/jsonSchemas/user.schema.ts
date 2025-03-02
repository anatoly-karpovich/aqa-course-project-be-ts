import { AllowedSchema } from "express-json-validator-middleware";

export const userSchema: AllowedSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    username: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
  required: ["username", "password", "firstName", "lastName"],
};
