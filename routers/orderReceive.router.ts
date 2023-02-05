import Router from "express";
import OrderReceiveController from "../controllers/orderReceive.controller.js";
import { orderReceiveValidations } from "../middleware/orderMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const orderReceiveRouter = Router();

orderReceiveRouter.post("/orders/receive", schemaMiddleware("orderReceiveSchema"), orderReceiveValidations, OrderReceiveController.receiveProducts);

export default orderReceiveRouter;
