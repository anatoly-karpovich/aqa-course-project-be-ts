import { AllowedSchema } from "express-json-validator-middleware";
import { COUNTRIES, DELIVERY, ORDER_STATUSES } from "../enums";
import { MAXIMUM_REQUESTED_PRODUCTS, MINIMUN_REQUESTED_PRODUCTS } from "../constants";

export const orderCreateSchema: AllowedSchema = {
  type: "object",
  properties: {
    customer: { type: "string" },
    products: {
      type: "array",
      items: { type: "string" },
      maxItems: MAXIMUM_REQUESTED_PRODUCTS,
      minItems: MINIMUN_REQUESTED_PRODUCTS,
    },
  },
  required: ["customer", "products"],
};

export const orderUpdateSchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      customer: { type: "string" },
      products: {
        type: "array",
        items: { type: "string" },
        maxItems: MAXIMUM_REQUESTED_PRODUCTS,
        minItems: MINIMUN_REQUESTED_PRODUCTS,
      },
    },
    required: ["_id" ,"customer", "products"],
  };

  export const orderReceiveSchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      products: {
        type: "array",
        items: { type: "string" },
        maxItems: MAXIMUM_REQUESTED_PRODUCTS,
        minItems: MINIMUN_REQUESTED_PRODUCTS,
      } 
    },
    required: ["_id", "products"],
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

  export const orderCommentsCreateSchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      comments: {
        type: "object",
        properties: {
          text: { type: "string" },
        },
        required: ["text"],
      },
    },
    required: ["_id", "comments"],
  };

  export const orderCommentsDeleteSchema: AllowedSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      comments: {
        type: "object",
        properties: {
          _id: { type: "string" },
        },
        required: ["_id"],
      },
    },
    required: ["_id", "comments"],
  };
