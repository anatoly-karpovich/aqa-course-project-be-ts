import { ROLES, VALIDATION_ERROR_MESSAGES } from "../data/enums";
import { Request, Response } from "express";
import User from "../models/user.model";
import Role from "../models/role.model";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import _ from "lodash";
import UsersService from "../services/users.service";

class UsersController {
  async registration(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //TODO: investigate how to fix below code
        //@ts-ignore
        const errorMessages = errors.errors.map((el) => el.msg);
        return res
          .status(400)
          .json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY, reason: errorMessages });
      }
      const { username, password, firstName, lastName } = req.body;

      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ IsSuccess: false, ErrorMessage: `User with username '${username}' already exists` });
      }

      const user = await UsersService.create({ username, password, firstName, lastName });

      return res.status(201).json({
        IsSuccess: true,
        ErrorMessage: null,
        User: user,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: "Registration error", reason: (e as Error).message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await UsersService.getUsers();
      res.json({ Users: users, IsSuccess: true, ErrorMessage: null });
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.GET_USERS, reason: (e as Error).message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error("Id was not provided");
      }
      const user = await UsersService.getUser(id);
      res.json({ User: user, IsSuccess: true, ErrorMessage: null });
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.GET_USERS, reason: (e as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error("Id was not provided");
      }

      const deletedUser = await UsersService.delete(id);
      res.status(204).json({ IsSuccess: true, ErrorMessage: null, User: deletedUser });
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: "Failed to delete user", reason: (e as Error).message });
    }
  }
}

export default new UsersController();
