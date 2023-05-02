import { Types } from "mongoose";

export interface IComment {
  readonly _id?: Types.ObjectId;
  readonly text: string;
  readonly createdOn: string;
}
