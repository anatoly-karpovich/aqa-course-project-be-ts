import { Router } from "express";
import UsersController from "../controllers/users.controller";
import { authmiddleware } from "../middleware/authmiddleware";

const usersRouter = Router();

usersRouter.get("/users", authmiddleware, UsersController.getUsers);

export default usersRouter;
