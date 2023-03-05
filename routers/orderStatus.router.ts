import OrderStatusController from "../controllers/orderStatus.controller.js";
import { orderById, orderStatus } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";
import { authmiddleware } from "../middleware/authmiddleware.js";

const orderStatusRouter = Router();

orderStatusRouter.put("/orders/status", authmiddleware, schemaMiddleware("orderStatusSchema"), orderById, orderStatus, OrderStatusController.update);

export default orderStatusRouter;
