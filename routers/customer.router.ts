import Router from "express";
import CustomerController from "../controllers/customer.controller.js";
import { customerValidations, customerById, deleteCustomer } from "../middleware/customerMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const customerRouter = Router();

customerRouter.post("/customers", schemaMiddleware("customerSchema"), customerValidations, CustomerController.create);
customerRouter.get("/customers", CustomerController.getAll);
customerRouter.get("/customers/:id", customerById, CustomerController.getCustomer);
customerRouter.put("/customers", schemaMiddleware("customerSchema"), customerById, customerValidations, CustomerController.update);
customerRouter.delete("/customers/:id", customerById, deleteCustomer, CustomerController.delete);

export default customerRouter;
