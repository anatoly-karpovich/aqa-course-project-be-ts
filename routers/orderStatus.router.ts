import OrderStatusController from "../controllers/orderStatus.controller.js";
import { orderById, orderStatus } from "../middleware/orderMiddleware.js";
import Router  from "express";

const orderStatusRouter = Router()

orderStatusRouter.put('/orderStatus', orderById, orderStatus, OrderStatusController.update)

export default orderStatusRouter