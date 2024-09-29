import Router from "express";
import CheckoutProductsController from "../../controllers/checkout/products.controller.js";

const checkoutProductsRouter = Router();

checkoutProductsRouter.post("/products", CheckoutProductsController.getAllBy);
checkoutProductsRouter.get("/products/:id", CheckoutProductsController.getProduct);

export default checkoutProductsRouter;
