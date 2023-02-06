import User from "../models/user.model";
import Role from "../models/role.model";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import { Request, Response } from "express";
import { Types } from "mongoose";

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
        return res.status(400).json({ IsSuccess: false, ErrorMessage: `Registration failed`, errors: errors.errors.map((el) => el.msg) });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: `User with username '${username}' already exists` });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: req.body.roles[0] });
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });
      await user.save();
      return res.status(201).json({IsSuccess: true, ErrorMessage: null});
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: "Registration error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: `User with username '${username}' wasn't found` });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: `Incorrect password for user '${username}' was provided` });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: "Login error" });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(400).json({ IsSuccess: false, ErrorMessage: e });
    }
  }
}

export default new AuthController();
