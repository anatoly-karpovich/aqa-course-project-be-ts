import { COUNTRIES, ORDER_STATUSES } from "../enums";
import { DocumentResult } from "./document.type";
import * as mongoose from 'mongoose';
import { ICustomer } from "./customer.type";
import { IProduct } from "./product.type";
import { IDelivery } from "./delivery.type";

export interface IOrderRequest extends mongoose.Document, DocumentResult<IOrder> {
  _id?: mongoose.Types.ObjectId;
  status: ORDER_STATUSES;
  customer: mongoose.Types.ObjectId;
  requestedProducts: mongoose.Types.ObjectId[];
  receivedProducts?: mongoose.Types.ObjectId[];
  delivery?: IDelivery;
  total_price: number;
  createdOn: string;
}

export interface IOrder extends mongoose.Document, DocumentResult<IOrder> {
  _id?: mongoose.Types.ObjectId;
  status: ORDER_STATUSES;
  customer: mongoose.Types.ObjectId;
  requestedProducts: IProduct[];
  receivedProducts?: IProduct[];
  delivery?: IDelivery;
  total_price: number;
  createdOn: string;
}

export interface IOrderResponse {
  _id?: mongoose.Types.ObjectId;
  status: string;
  customer: ICustomer;
  requestedProducts: IProduct[];
  receivedProducts?: IProduct[];
  delivery?: IDelivery;
  total_price: number;
  createdOn: string;
}
