import { AllowedSchema } from "express-json-validator-middleware";
import { COUNTRIES, DELIVERY, ORDER_STATUSES } from "../enums";

export const orderCreateSchema: AllowedSchema = {
  type: "object",
  properties: {
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

export const orderUpdateSchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      customer: { type: "string" },
      requestedProducts: {
        type: "array",
        items: { type: "string" },
        maxItems: 5,
        minItems: 1,
      },
    },
    required: ["_id" ,"customer", "requestedProducts"],
  };

  export const orderReceiveSchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      requestedProducts: {
        type: "array",
        items: { type: "string" },
        maxItems: 5,
        minItems: 1,
      } 
    },
    required: ["_id", "receivedProducts"],
  };

  export const orderStatusSchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      status:  { type: "string", enum: Object.values(ORDER_STATUSES) } 
    },
    required: ["_id", "status"],
  };

  export const orderDeliverySchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      delivery: {
        type: "object",
        properties: {
          finalDate: { type: "string" },
          condition: { type: "string", enum: Object.values(DELIVERY) },
          address: {
            type: "object",
            properties: {
              country: { type: "string", enum: Object.values(COUNTRIES) },
              city: { type: "string" },
              street: { type: "string" },
              house: { type: "integer" },
              flat: { type: "integer" },
            },
            required: ["country", "city", "street", "house", "flat"],
          },
        },
        required: ["finalDate", "condition", "address"],
      },
    },
    required: ["_id", "delivery"],
  };
