import mongoose, { Types } from "mongoose";
import { DocumentResult } from ".";
import { MANUFACTURERS } from "../enums";

export interface IProduct extends DocumentResult<IProduct> {
  _id?: Types.ObjectId;
  name: string;
  amount: number;
  price: number;
  manufacturer: MANUFACTURERS;
  createdOn: string;
  notes?: string;
}

export interface IProductDocument extends IProduct, mongoose.Document {
  _id?: Types.ObjectId;
}

export interface IProductFilters {
  manufacturers?: string | string[];
  search: string;
}
