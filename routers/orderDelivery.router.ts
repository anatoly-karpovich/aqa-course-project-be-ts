import OrderDeliveryController from "../controllers/orderDelivery.controller.js";
import { orderById, orderDelivery } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const orderDeliveryRouter = Router();

orderDeliveryRouter.post("/orders/delivery", schemaMiddleware("orderDeliverySchema"), orderById, orderDelivery, OrderDeliveryController.update);

export default orderDeliveryRouter;
