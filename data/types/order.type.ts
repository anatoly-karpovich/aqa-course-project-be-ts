import { COUNTRIES, ORDER_STATUSES } from "../enums";
import { DocumentResult } from "./document.type";
import * as mongoose from 'mongoose';
import { ICustomer } from "./customer.type";
import { IProduct } from "./product.type";
import { IDelivery } from "./delivery.type";

export interface IOrderRequest extends mongoose.Document, DocumentResult<IOrder> {
  readonly _id?: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  requestedProducts: mongoose.Types.ObjectId[];
}

export interface IOrder extends mongoose.Document, DocumentResult<IOrder> {
  readonly _id?: mongoose.Types.ObjectId;
  status: ORDER_STATUSES;
  customer: mongoose.Types.ObjectId;
  requestedProducts: IProduct[];
  notReceivedProducts?: IProduct[];
  receivedProducts?: IProduct[];
  delivery?: IDelivery;
  total_price: number;
  createdOn: string;
  history: Omit<IOrder, 'history' | 'notReceivedProducts'> & Required<{changedOn: string}>[];
}

export interface IOrderResponse {
  readonly _id?: mongoose.Types.ObjectId;
  status: ORDER_STATUSES;
  customer: ICustomer;
  requestedProducts: IProduct[];
  notReceivedProducts?: IProduct[];
  receivedProducts?: IProduct[];
  delivery?: IDelivery;
  total_price: number;
  createdOn: string;
  history: Omit<IOrder, 'history' | 'notReceivedProducts'> & Required<{changedOn: string}>[];
}