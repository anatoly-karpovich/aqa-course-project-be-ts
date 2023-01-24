import { ORDER_STATUSES } from "../enums";
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
  notReceivedProducts: IProduct[];
  receivedProducts: IProduct[];
  delivery: IDelivery | null;
  total_price: number;
  createdOn: string;
  history: IHistory[];
}

export interface IOrderResponse {
  readonly _id?: mongoose.Types.ObjectId;
  status: ORDER_STATUSES;
  customer: ICustomer;
  requestedProducts: IProduct[];
  notReceivedProducts: IProduct[];
  receivedProducts: IProduct[];
  delivery: IDelivery | null;
  total_price: number;
  createdOn: string;
  history: IHistory[];
}

export interface IHistory {
  readonly status: string,
  readonly customer: string;
  readonly requestedProducts: IProduct[];
  readonly receivedProducts: IProduct[];
  readonly delivery: IDelivery | null;
  readonly total_price: number;
  readonly changedOn: string
}

export type OrderType = {
  readonly _id?: mongoose.Types.ObjectId;
  status: ORDER_STATUSES;
  customer: string;
  requestedProducts: IProduct[];
  notReceivedProducts: IProduct[];
  receivedProducts: IProduct[];
  delivery: IDelivery | null;
  total_price: number;
  createdOn: string;
  history: IHistory[];
}