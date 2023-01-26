import mongoose from "mongoose";
import { DELIVERY } from "../data/enums";
import { IOrderDocument } from "../data/types";

const product = new mongoose.Schema(
  {
    _id: { type: mongoose.SchemaTypes.ObjectId },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    notes: { type: String, required: false },
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
      address: { type: String, required: true },
    },
  },
  { _id: false }
);

const history = new mongoose.Schema(
  {
    status: { type: String, required: true },
    customer: { type: String, required: true },
    requestedProducts: [{ type: product, required: true }],
    receivedProducts: [{ type: product, required: true }],
    total_price: { type: Number, require: true },
    delivery: { type: delivery, required: false },
    changedOn: { type: Date, required: true },
  },
  { _id: false }
);

const Order = new mongoose.Schema({
  status: { type: String, required: true },
  customer: { type: mongoose.SchemaTypes.ObjectId, ref: "Customer", required: true },
  requestedProducts: [{ type: product, required: true }],
  notReceivedProducts: [{ type: product, required: true }],
  receivedProducts: [{ type: product, required: true }],
  delivery: { type: delivery, required: false },
  total_price: { type: Number, require: true },
  createdOn: { type: Date, required: true },
  history: [{ type: history, required: false }],
  //   createdBy: { type: String, required: true },
});

export default mongoose.model<IOrderDocument>("Order", Order);
