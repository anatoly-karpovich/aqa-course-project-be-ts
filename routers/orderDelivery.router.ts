import OrderDeliveryController from "../controllers/orderDelivery.controller.js";
import { orderById, orderDelivery } from "../middleware/orderMiddleware.js";
import Router from "express";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";
import { authmiddleware } from "../middleware/authmiddleware.js";

const orderDeliveryRouter = Router();

orderDeliveryRouter.post("/orders/delivery", authmiddleware, schemaMiddleware("orderDeliverySchema"), orderById, orderDelivery, OrderDeliveryController.update);

export default orderDeliveryRouter;
