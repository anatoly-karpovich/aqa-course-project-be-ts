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
 *     ProductWithoutId:
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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *         description: Bearer token for authentication
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
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Server error
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
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *         description: Bearer token for authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The product by Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Server error
 */

productsRouter.get("/products/:id", authmiddleware, productById, ProductsController.getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *         description: Bearer token for authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductWithoutId'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       409:
 *         description: Conflict, product already exists
 *       500:
 *         description: Server error
 */

productsRouter.post(
  "/products",
  authmiddleware,
  schemaMiddleware("productSchema"),
  uniqueProduct,
  productValidations,
  ProductsController.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update the product by Id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *         description: Bearer token for authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: The product was not found
 *       409:
 *         description: Conflict, unable to update the product
 *       500:
 *         description: Server error
 */

productsRouter.put(
  "/products",
  authmiddleware,
  schemaMiddleware("productSchema"),
  uniqueProduct,
  productById,
  productValidations,
  ProductsController.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete the product by Id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT token>
 *         description: Bearer token for authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: The product was successfully deleted
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: The product was not found
 *       409:
 *         description: Conflict, unable to delete the product
 *       500:
 *         description: Server error
 */

productsRouter.delete("/products/:id", authmiddleware, productById, deleteProduct, ProductsController.delete);

export default productsRouter;
