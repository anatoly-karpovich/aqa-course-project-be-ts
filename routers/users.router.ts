import { Router } from "express";
import UsersController from "../controllers/users.controller";
import { authmiddleware } from "../middleware/authmiddleware";
import { check } from "express-validator";
import { schemaMiddleware } from "../middleware/schemaMiddleware";
import { roleMiddleware } from "../middleware/rolemiddleware";
import { ROLES } from "../data/enums";
import { deleteUserMiddleware } from "../middleware/usersMiddleware";

const usersRouter = Router();

usersRouter.get("/users", authmiddleware, UsersController.getUsers);
usersRouter.get("/users/:id", authmiddleware, UsersController.getUser);

usersRouter.post(
  "/users",
  authmiddleware,
  roleMiddleware(ROLES.ADMIN),
  [
    check("username", "Username is required").notEmpty(),
    check("password", `Password can't be less then 8 characters`).isLength({ min: 8 }),
  ],
  schemaMiddleware("userSchema"),
  UsersController.registration
);
usersRouter.delete(
  "/users/:id",
  authmiddleware,
  roleMiddleware(ROLES.ADMIN),
  deleteUserMiddleware,
  UsersController.deleteUser
);

export default usersRouter;
