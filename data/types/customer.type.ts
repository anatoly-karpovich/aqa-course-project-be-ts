import { COUNTRIES } from "../enums";
import { DocumentResult } from "./";
import mongoose, { Types } from "mongoose";

export interface ICustomer {
  _id?: Types.ObjectId;
  email: string;
  name: string;
  country: COUNTRIES;
  city: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface ICustomerDocument extends ICustomer, DocumentResult<ICustomer>, mongoose.Document {
  _id?: Types.ObjectId;
}
