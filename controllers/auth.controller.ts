import User from "../models/user.model";
import Role from "../models/role.model";
import Token from "../models/token.model";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import { Request, Response } from "express";
import { Types } from "mongoose";
import _ from "lodash";
import { ROLES, VALIDATION_ERROR_MESSAGES } from "../data/enums";

const generateAccessToken = (id: Types.ObjectId, roles: string[]) => {
  const payload = {
    id,
    roles,
  };
  return jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });
};

class AuthController {
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
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
      }
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ IsSuccess: false, ErrorMessage: `User with username '${username}' already exists` });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: ROLES.USER });
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });
      await user.save();
      return res.status(201).json({
        IsSuccess: true,
        ErrorMessage: null,
        User: {
          username: user.username,
          roles: user.roles,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: "Registration error", reason: (e as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: "Incorrect credentials" });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: "Incorrect credentials" });
      }

      await Token.deleteMany({ expiresAt: { $lt: new Date() } });

      const token = generateAccessToken(user._id, user.roles);
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await new Token({ userId: user._id, token, expiresAt: expirationDate }).save();

      return res
        .header("Authorization", token)
        .header("X-User-Name", user.username)
        .json({ IsSuccess: true, ErrorMessage: null });
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: "Login error", reason: (e as Error).message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      // Удаляем только этот конкретный токен
      await Token.deleteOne({ token });

      return res.json({ IsSuccess: true, ErrorMessage: null });
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: "Logout error", reason: (e as Error).message });
    }
  }
}

export default new AuthController();
