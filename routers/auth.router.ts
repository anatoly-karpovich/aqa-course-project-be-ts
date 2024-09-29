import Router from "express";
import AuthController from "../controllers/auth.controller.js";
import { check } from "express-validator";
import { authmiddleware } from "../middleware/authmiddleware.js";
// import { roleMiddleware } from "../middleware/rolemiddleware.js";
import { ROLES } from "../data/enums.js";

const authRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLogin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         username: "user123@example.com"
 *         password: "Password123"
 *
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 IsSuccess:
 *                   type: boolean
 *                   description: Operation success flag
 *                 ErrorMessage:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Incorrect credentials or login error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 IsSuccess:
 *                   type: boolean
 *                   description: Operation success flag
 *                 ErrorMessage:
 *                   type: string
 *                   description: Error message in case of failure
 */

authRouter.post(
  "/registration",
  [
    check("username", "Username is required").notEmpty(),
    check("password", `Password can't be less then 8 characters`).isLength({ min: 8 }),
  ],
  AuthController.registration
);
authRouter.post("/login", AuthController.login);
// authRouter.get('/users', authmiddleware, AuthController.getUsers) FOR CHECHING AUTHORIZATION
// authRouter.get('/users', roleMiddleware(ROLES.ADMIN), AuthController.getUsers)

export default authRouter;
