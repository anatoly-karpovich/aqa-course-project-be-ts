import OrderDeliveryController from "../controllers/orderDelivery.controller.js";
import { orderById, orderDelivery } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";
import { authmiddleware } from "../middleware/authmiddleware.js";

const orderDeliveryRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDelivery:
 *       type: object
 *       required:
 *         - _id
 *         - delivery
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         delivery:
 *           type: object
 *           required:
 *             - finalDate
 *             - condition
 *             - address
 *           properties:
 *             finalDate:
 *               type: string
 *               format: date
 *               description: The final delivery date
 *             condition:
 *               type: string
 *               enum: [Delivery, Pickup]
 *               description: The delivery condition (e.g., Delivery or Pickup)
 *             address:
 *               type: object
 *               required:
 *                 - country
 *                 - city
 *                 - street
 *                 - house
 *                 - flat
 *               properties:
 *                 country:
 *                   type: string
 *                   enum: [USA, Canada, Belarus, Ukraine, Germany, France, Great Britain, Russia]
 *                   description: The country of the address
 *                 city:
 *                   type: string
 *                   description: The city of the address
 *                 street:
 *                   type: string
 *                   description: The street of the address
 *                 house:
 *                   type: number
 *                   description: The house number
 *                 flat:
 *                   type: number
 *                   description: The flat number
 *       example:
 *         _id: "644e9c138ec7cfb87585643d"
 *         delivery:
 *           finalDate: "2023/04/30"
 *           condition: "Pickup"
 *           address:
 *             country: "USA"
 *             city: "Homel"
 *             street: "Best street"
 *             house: 5
 *             flat: 1
 *
 * /api/orders/delivery:
 *   post:
 *     summary: Update delivery details of an order
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
 *             $ref: '#/components/schemas/OrderDelivery'
 *     responses:
 *       200:
 *         description: The order delivery details were successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderDeliveryRouter.post(
  "/orders/delivery",
  authmiddleware,
  schemaMiddleware("orderDeliverySchema"),
  orderById,
  orderDelivery,
  OrderDeliveryController.update
);

export default orderDeliveryRouter;
