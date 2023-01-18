import Router  from "express";
import OrderReceiveController from "../controllers/orderReceive.controller.js";
import { orderReceiveValidations } from "../middleware/orderMiddleware.js";

const orderReceiveRouter = Router()

orderReceiveRouter.post('/receive', orderReceiveValidations, OrderReceiveController.receiveProducts)

export default orderReceiveRouter