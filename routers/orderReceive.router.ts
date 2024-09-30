import Router from "express";
import OrderReceiveController from "../controllers/orderReceive.controller.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
import { orderReceiveValidations } from "../middleware/orderMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const orderReceiveRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderReceive:
 *       type: object
 *       required:
 *         - _id
 *         - products
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           description: List of product IDs being received, can contain up to 5 identical products
 *       example:
 *         _id: "644e9c138ec7cfb87585643d"
 *         products:
 *           - "6447bd766e52f1d354d2f0bf"
 *           - "6447bd766e52f1d354d2f0bf"
 *           - "6447bd766e52f1d354d2f0bf"
 *           - "6447bd766e52f1d354d2f0bf"
 *           - "6447bd766e52f1d354d2f0bf"
 *
 * /api/orders/receive:
 *   post:
 *     summary: Mark products as received in an order
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *         description: Bearer token for authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderReceive'
 *     responses:
 *       200:
 *         description: Products in the order were successfully marked as received
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Order or products not found
 *       500:
 *         description: Server error
 */
orderReceiveRouter.post(
  "/orders/receive",
  authmiddleware,
  schemaMiddleware("orderReceiveSchema"),
  orderReceiveValidations,
  OrderReceiveController.receiveProducts
);

export default orderReceiveRouter;
