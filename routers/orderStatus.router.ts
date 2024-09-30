import OrderStatusController from "../controllers/orderStatus.controller.js";
import { orderById, orderStatus } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";
import { authmiddleware } from "../middleware/authmiddleware.js";

const orderStatusRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStatusUpdate:
 *       type: object
 *       required:
 *         - _id
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         status:
 *           type: string
 *           enum: [Draft, In Process, Partially Received, Received, Canceled]
 *           description: The new status of the order
 *       example:
 *         _id: "648870eb40c84614b7a8cd11"
 *         status: "In Process"
 *
 * /api/orders/status:
 *   put:
 *     summary: Update the status of an order
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
 *             $ref: '#/components/schemas/OrderStatusUpdate'
 *     responses:
 *       200:
 *         description: The order status was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: The order was not found
 *       500:
 *         description: Server error
 */
orderStatusRouter.put(
  "/orders/status",
  authmiddleware,
  schemaMiddleware("orderStatusSchema"),
  orderById,
  orderStatus,
  OrderStatusController.update
);

export default orderStatusRouter;
