import { ORDER_STATUSES } from "../enums";
import * as mongoose from "mongoose";
import type { ICustomer, IProduct, IDelivery, DocumentResult } from "./";

export interface IOrder<T> {
  readonly _id?: mongoose.Types.ObjectId;
  status: ORDER_STATUSES;
  customer: T extends ICustomer ? ICustomer : T extends mongoose.Types.ObjectId ? mongoose.Types.ObjectId : string;
  requestedProducts: IProduct[];
  notReceivedProducts: IProduct[];
  receivedProducts: IProduct[];
  delivery: IDelivery | null;
  total_price: number;
  createdOn: string;
  history: IHistory[];
}

export interface IOrderRequest extends mongoose.Document, DocumentResult<IOrderDocument> {
  readonly _id?: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  requestedProducts: mongoose.Types.ObjectId[];
}

export interface IOrderDocument extends IOrder<mongoose.Types.ObjectId>, mongoose.Document, DocumentResult<IOrderDocument> {
  readonly _id: mongoose.Types.ObjectId;
}

export interface IHistory {
  readonly status: string;
  readonly customer: string;
  readonly requestedProducts: IProduct[];
  readonly receivedProducts: IProduct[];
  readonly delivery: IDelivery | null;
  readonly total_price: number;
  readonly changedOn: string;
}
