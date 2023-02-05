import Router from "express";
import OrderController from "../controllers/order.controller.js";
import { orderById, orderValidations, orderUpdateValidations } from "../middleware/orderMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const orderRouter = Router();

orderRouter.post("/orders", schemaMiddleware("orderCreateSchema"), orderValidations, OrderController.create);
orderRouter.get("/orders", OrderController.getAll);
orderRouter.get("/orders/:id", orderById, OrderController.getOrder);
orderRouter.put("/orders", schemaMiddleware("orderCreateSchema"), orderUpdateValidations, orderValidations, OrderController.update);
orderRouter.delete("/orders/:id", orderById, OrderController.delete);

export default orderRouter;
