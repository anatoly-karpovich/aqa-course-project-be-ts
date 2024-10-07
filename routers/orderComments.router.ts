import OrderCommentsController from "../controllers/orderComments.controller.js";
import { orderById, orderCommentsCreate, orderCommentsDelete } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";
import { authmiddleware } from "../middleware/authmiddleware.js";

const orderCommentsRouter = Router();

/**
 * @swagger
 * /api/orders/{id}/comments:
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
 *         description: Bearer token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Comment text
 *             required:
 *               - comment
 *           example:
 *             comment: "Great service!"
 *     responses:
 *       200:
 *         description: Comment successfully added to the order
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

orderCommentsRouter.post(
  "/orders/:id/comments",
  authmiddleware,
  schemaMiddleware("orderCommentsCreateSchema"),
  orderCommentsCreate,
  orderById,
  OrderCommentsController.create
);

/**
 * @swagger
 * /api/orders/{id}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment from an order
 *     tags: [Orders]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *         description: Bearer token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Comment successfully deleted, no content
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Order or comment not found
 *       500:
 *         description: Server error
 */

orderCommentsRouter.delete(
  "/orders/:id/comments/:commentId",
  authmiddleware,
  orderById,
  orderCommentsDelete,
  OrderCommentsController.delete
);

export default orderCommentsRouter;
