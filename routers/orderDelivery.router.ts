import OrderDeliveryController from "../controllers/orderDelivery.controller.js";
import { orderById, orderDelivery } from "../middleware/orderMiddleware.js";
import Router  from "express";

const orderDeliveryRouter = Router()

orderDeliveryRouter.post('/orders/delivery', orderById, orderDelivery, OrderDeliveryController.update)

export default orderDeliveryRouter