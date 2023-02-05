import Router from "express";
import ProductsController from "../controllers/products.controller.js";
import { productValidations, productById, deleteProduct } from "../middleware/productMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const productsRouter = Router();

// productsRouter.post('/products', authmiddleware, productMiddleware, ProductsController.create)

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - amount
 *         - price
 *         - manufacturer
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The products name
 *         amount:
 *           type: number
 *           description: The products amount
 *         price:
 *           type: number
 *           description: The products price
 *         manufacturer:
 *           type: string
 *           description: The products manufactirer
 *         notes:
 *           type: string
 *           description: The products notes
 *         __v:
 *           type: number,
 *           desctiption: Data version in mongoDB, no need to send any time
 *       example:
 *         "_id": "6396593e54206d313b2a50b7"
 *         "name": "product 1"
 *         "amount": 1
 *         "price": 1
 *         "manufacturer": "Apple"
 *         "notes": "note 1"
 *         "__v": 0
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management service
 */

/**
 * @swagger
 * /api/Products:
 *   get:
 *     summary: Returns the list of all the Products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

productsRouter.get("/products", ProductsController.getAll);

productsRouter.get("/products/:id", productById, ProductsController.getProduct);

productsRouter.post("/products", schemaMiddleware("productSchema"), productValidations, ProductsController.create);

productsRouter.put("/products", schemaMiddleware("productSchema"), productById, productValidations, ProductsController.update);

productsRouter.delete("/products/:id", productById, deleteProduct, ProductsController.delete);

export default productsRouter;
