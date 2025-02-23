import { VALIDATION_ERROR_MESSAGES } from "../data/enums";
import { Request, Response } from "express";
import User from "../models/user.model";
import _ from "lodash";

class UsersController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = (await User.find()).map((user) => {
        return _.omit(user.toJSON(), ["password"]);
      });
      res.json({ Users: users, IsSuccess: true, ErrorMessage: null });
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.GET_USERS, reason: (e as Error).message });
    }
  }
}

export default new UsersController();
