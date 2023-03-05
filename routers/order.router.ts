import Router from "express";
import OrderController from "../controllers/order.controller.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
import { orderById, orderValidations, orderUpdateValidations } from "../middleware/orderMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const orderRouter = Router();

orderRouter.post("/orders", authmiddleware, schemaMiddleware("orderCreateSchema"), orderValidations, OrderController.create);
orderRouter.get("/orders", authmiddleware, OrderController.getAll);
orderRouter.get("/orders/:id", authmiddleware, orderById, OrderController.getOrder);
orderRouter.put("/orders", authmiddleware, schemaMiddleware("orderUpdateSchema"), orderUpdateValidations, orderValidations, OrderController.update);
orderRouter.delete("/orders/:id", authmiddleware, orderById, OrderController.delete);

export default orderRouter;
