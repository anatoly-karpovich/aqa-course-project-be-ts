import mongoose from "mongoose";
import { DELIVERY, ORDER_HISTORY_ACTIONS } from "../data/enums";
import { IOrderDocument } from "../data/types";

const product = new mongoose.Schema(
  {
    _id: { type: mongoose.SchemaTypes.ObjectId },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    notes: { type: String, required: false },
    received: {type: Boolean, required: true }
  },
  { _id: false }
);

const delivery = new mongoose.Schema(
  {
    finalDate: { type: Date, required: true },
    condition: { type: String, enum: DELIVERY, required: true },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      house: { type: Number, required: true },
      flat: { type: Number, required: true },
    },
  },
  { _id: false }
);

const history = new mongoose.Schema(
  {
    status: { type: String, required: true },
    customer: { type: String, required: true },
    products: [{ type: product, required: true }],
    total_price: { type: Number, require: true },
    delivery: { type: delivery, required: false },
    changedOn: { type: Date, required: true },
    action: { type: String, enum: ORDER_HISTORY_ACTIONS, required: true}
  },
  { _id: false }
);

const Order = new mongoose.Schema({
  status: { type: String, required: true },
  customer: { type: mongoose.SchemaTypes.ObjectId, ref: "Customer", required: true },
  products: [{ type: product, required: true }],
  delivery: { type: delivery, required: false },
  total_price: { type: Number, require: true },
  createdOn: { type: Date, required: true },
  history: [{ type: history, required: false }],
  //   createdBy: { type: String, required: true },
}, { versionKey: false });

export default mongoose.model<IOrderDocument>("Order", Order);
