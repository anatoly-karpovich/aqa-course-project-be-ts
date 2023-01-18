import Router  from "express";
import AuthController from "../controllers/auth.controller.js";
import { check } from 'express-validator';
import { authmiddleware } from "../middleware/authmiddleware.js";
// import { roleMiddleware } from "../middleware/rolemiddleware.js";
import { ROLES } from '../data/enums.js'


const authRouter = Router()

authRouter.post('/registration', [
    check('username', 'Username is required').notEmpty(),
    check('password', `Password can't be less then 8 characters`).isLength({min: 8})
], AuthController.registration)
authRouter.post('/login', AuthController.login)
// authRouter.get('/users', authmiddleware, AuthController.getUsers) FOR CHECHING AUTHORIZATION
// authRouter.get('/users', roleMiddleware(ROLES.ADMIN), AuthController.getUsers)

export default authRouter;