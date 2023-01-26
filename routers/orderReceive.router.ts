import Router from "express";
import OrderReceiveController from "../controllers/orderReceive.controller.js";
import { orderReceiveValidations } from "../middleware/orderMiddleware.js";

const orderReceiveRouter = Router();

orderReceiveRouter.post("/orders/receive", orderReceiveValidations, OrderReceiveController.receiveProducts);

export default orderReceiveRouter;
