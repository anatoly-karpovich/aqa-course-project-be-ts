import Router from "express";
import CustomerController from "../controllers/customer.controller.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
import { customerValidations, customerById, deleteCustomer, uniqueCustomer } from "../middleware/customerMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const customerRouter = Router();

customerRouter.post("/customers", authmiddleware, schemaMiddleware("customerSchema"), uniqueCustomer, customerValidations, CustomerController.create);
customerRouter.get("/customers", authmiddleware, CustomerController.getAll);
customerRouter.get("/customers/:id", authmiddleware, customerById, CustomerController.getCustomer);
customerRouter.put("/customers", authmiddleware, schemaMiddleware("customerSchema"), uniqueCustomer, customerById, customerValidations, CustomerController.update);
customerRouter.delete("/customers/:id", authmiddleware, customerById, deleteCustomer, CustomerController.delete);

export default customerRouter;
