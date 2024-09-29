import Router from "express";
import OrderController from "../controllers/order.controller.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
import { orderById, orderValidations, orderUpdateValidations } from "../middleware/orderMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const orderRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - status
 *         - customer
 *         - products
 *         - total_price
 *         - createdOn
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order
 *         status:
 *           type: string
 *           enum: [Draft, In Process, Partially Received, Received, Canceled]
 *           description: The current status of the order
 *         customer:
 *           type: string
 *           description: The customer associated with the order
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInOrder'
 *           description: List of products in the order
 *         total_price:
 *           type: number
 *           description: Total price of the order
 *         createdOn:
 *           type: string
 *           format: date-time
 *           description: Date the order was created
 *         delivery:
 *           $ref: '#/components/schemas/Delivery'
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Comments related to the order
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderHistory'
 *           description: History of the order
 *       example:
 *         _id: "648870eb40c84614b7a8cd11"
 *         status: "Draft"
 *         customer: "648870eb40c84614b7a8cd12"
 *         products:
 *           - _id: "648870eb40c84614b7a8cd13"
 *             name: "Product 1"
 *             amount: 2
 *             price: 100
 *             manufacturer: "Apple"
 *             notes: "Some notes"
 *             received: false
 *         total_price: 200
 *         createdOn: "2023-09-29T12:00:00Z"
 *         comments:
 *           - text: "Order placed"
 *             createdOn: "2023-09-29T12:05:00Z"
 *         history:
 *           - status: "Draft"
 *             customer: "648870eb40c84614b7a8cd12"
 *             products:
 *               - _id: "648870eb40c84614b7a8cd13"
 *                 name: "Product 1"
 *             total_price: 200
 *             action: "Order created"
 *             changedOn: "2023-09-29T12:00:00Z"
 *
 *     ProductInOrder:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         amount:
 *           type: number
 *         price:
 *           type: number
 *         manufacturer:
 *           type: string
 *           enum: [Apple, Samsung, Google, Microsoft, Sony, Xiaomi, Amazon, Tesla]
 *         received:
 *           type: boolean
 *           description: Whether the product has been received or not
 *
 *     Delivery:
 *       type: object
 *       properties:
 *         finalDate:
 *           type: string
 *           format: date-time
 *         condition:
 *           type: string
 *           enum: [Delivery, Pickup]
 *         address:
 *           type: object
 *           properties:
 *             country:
 *               type: string
 *               enum: [USA, Canada, Belarus, Ukraine, Germany, France, Great Britain, Russia]
 *             city:
 *               type: string
 *             street:
 *               type: string
 *             house:
 *               type: number
 *             flat:
 *               type: number
 *
 *     Comment:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *         createdOn:
 *           type: string
 *           format: date-time
 *
 *     OrderHistory:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         customer:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInOrder'
 *         total_price:
 *           type: number
 *         action:
 *           type: string
 *           enum: [Order created, Customer changed, Requested products changed, Order processing started, Delivery Scheduled, Delivery Edited, Received, Received All, Order canceled]
 *         changedOn:
 *           type: string
 *           format: date-time
 *
 * tags:
 *   name: Orders
 *   description: Orders management service
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Server error
 */
orderRouter.post(
  "/orders",
  authmiddleware,
  schemaMiddleware("orderCreateSchema"),
  orderValidations,
  OrderController.create
);
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get the list of orders
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *     responses:
 *       200:
 *         description: The list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Server error
 */
orderRouter.get("/orders", authmiddleware, OrderController.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get the order by Id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *     responses:
 *       200:
 *         description: The order by Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.get("/orders/:id", authmiddleware, orderById, OrderController.getOrder);

/**
 * @swagger
 * /api/orders:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: The order was successfully updated
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
 *       409:
 *         description: Conflict, unable to update the order
 *       500:
 *         description: Server error
 */
orderRouter.put(
  "/orders",
  authmiddleware,
  schemaMiddleware("orderUpdateSchema"),
  orderUpdateValidations,
  orderValidations,
  OrderController.update
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete the order by Id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *     responses:
 *       204:
 *         description: The order was successfully deleted
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.delete("/orders/:id", authmiddleware, orderById, OrderController.delete);

export default orderRouter;
