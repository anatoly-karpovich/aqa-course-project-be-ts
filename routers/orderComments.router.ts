import OrderCommentsController from "../controllers/orderComments.controller.js";
import { orderById, orderCommentsCreate, orderCommentsDelete } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";
import { authmiddleware } from "../middleware/authmiddleware.js";

const orderCommentsRouter = Router();

orderCommentsRouter.post("/orders/comments", authmiddleware, schemaMiddleware("orderCommentsCreateSchema"), orderCommentsCreate, orderById, OrderCommentsController.create);
orderCommentsRouter.put("/orders/comments", authmiddleware, schemaMiddleware("orderCommentsDeleteSchema"), orderById, orderCommentsDelete, OrderCommentsController.delete);

export default orderCommentsRouter;
