import OrderCommentsController from "../controllers/orderComments.controller.js";
import { orderById, orderCommentsCreate, orderCommentsDelete } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";
import { authmiddleware } from "../middleware/authmiddleware.js";

const orderCommentsRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderCommentCreate:
 *       type: object
 *       required:
 *         - _id
 *         - comments
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         comments:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             text:
 *               type: string
 *               description: Comment text
 *       example:
 *         _id: "644e9c138ec7cfb87585643d"
 *         comments:
 *           text: "Great service!"
 *
 *     OrderCommentDelete:
 *       type: object
 *       required:
 *         - _id
 *         - comments
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         comments:
 *           type: object
 *           required:
 *             - _id
 *           properties:
 *             _id:
 *               type: string
 *               description: The comment ID
 *       example:
 *         _id: "644e9c138ec7cfb87585643d"
 *         comments:
 *           _id: "645189c01b1eccc04f9aba5d"
 *
 * /api/orders/comments:
 *   post:
 *     summary: Add a comment to an order
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
 *             $ref: '#/components/schemas/OrderCommentCreate'
 *     responses:
 *       200:
 *         description: Comment successfully added to the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderCommentCreate'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Delete a comment from an order
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
 *             $ref: '#/components/schemas/OrderCommentDelete'
 *     responses:
 *       200:
 *         description: Comment successfully deleted from the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderCommentDelete'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Order or comment not found
 *       500:
 *         description: Server error
 */

orderCommentsRouter.post(
  "/orders/comments",
  authmiddleware,
  schemaMiddleware("orderCommentsCreateSchema"),
  orderCommentsCreate,
  orderById,
  OrderCommentsController.create
);
orderCommentsRouter.put(
  "/orders/comments",
  authmiddleware,
  schemaMiddleware("orderCommentsDeleteSchema"),
  orderById,
  orderCommentsDelete,
  OrderCommentsController.delete
);

export default orderCommentsRouter;
