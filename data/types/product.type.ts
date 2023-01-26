import mongoose, { Types } from "mongoose";
import { DocumentResult } from "./";
import { MANUFACTURER } from "../enums";

export interface IProduct extends DocumentResult<IProduct> {
  _id?: Types.ObjectId;
  name: string;
  amount: number;
  price: number;
  manufacturer: MANUFACTURER;
  notes?: string;
}

export interface IProductDocument extends IProduct, mongoose.Document {
  _id?: Types.ObjectId;
}
