import Router from "express";
import ProductsController from "../controllers/products.controller.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
import { productValidations, productById, deleteProduct, uniqueProduct } from "../middleware/productMiddleware.js";
import { schemaMiddleware } from "../middleware/schemaMiddleware.js";

const productsRouter = Router();

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
 *           enum: [Apple, Samsung, Google, Microsoft, Sony, Xiaomi, Amazon, Tesla]
 *           description: The products manufactirer
 *         notes:
 *           type: string
 *           description: The products notes
 *       example:
 *         "_id": "6396593e54206d313b2a50b7"
 *         "name": "product 1"
 *         "amount": 1
 *         "price": 1
 *         "manufacturer": "Apple"
 *         "notes": "note 1"
 *
 *     Product without id:
 *       type: object
 *       required:
 *         - name
 *         - amount
 *         - price
 *         - manufacturer
 *       properties:
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
 *           enum: [Apple, Samsung, Google, Microsoft, Sony, Xiaomi, Amazon, Tesla]
 *           description: The products manufactirer
 *         notes:
 *           type: string
 *           description: The products notes
 *       example:
 *         "name": "product 1"
 *         "amount": 1
 *         "price": 1
 *         "manufacturer": "Apple"
 *         "notes": "note 1"
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management service
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get the list of products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
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

productsRouter.get("/products", authmiddleware, ProductsController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get the product by Id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product by Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */

productsRouter.get("/products/:id", authmiddleware, productById, ProductsController.getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product without id'
 *     responses:
 *       200:
 *         description: The product was seccessfully created
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

productsRouter.post("/products", authmiddleware, schemaMiddleware("productSchema"), uniqueProduct, productValidations, ProductsController.create);

/**
 * @swagger
 * /api/products:
 *   put:
 *     summary: Update the product by id
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was seccessfully updated
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Conflict error
 *       500:
 *         description: Server error
 */

productsRouter.put("/products", authmiddleware, schemaMiddleware("productSchema"), uniqueProduct, productById, productValidations, ProductsController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       204:
 *         description: The product successfully deleted
 *       404:
 *         description: The product was not found
 *       409:
 *         description: Conflict error
 */

productsRouter.delete("/products/:id", authmiddleware, productById, deleteProduct, ProductsController.delete);

export default productsRouter;
