import { ROLES } from "../enums";
import mongoose, { Types } from "mongoose";

export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IUserWithRoles {
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  _id: Types.ObjectId;
  createdOn: string;
}
