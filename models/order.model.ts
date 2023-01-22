import mongoose from "mongoose";
import { DELIVERY } from "../data/enums";
import { IOrder } from "../data/types/order.type";

const delivery = new mongoose.Schema({
  finalDate: { type: Date, required: true },
  condition: { type: String, enum: DELIVERY, required: true },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
  },
}, {_id: false});

const history = new mongoose.Schema({ 
  status: { type: String, required: true },
  customer: { type: mongoose.SchemaTypes.ObjectId, ref: "Customer", required: true },
  requestedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
  receivedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
  delivery: { type: delivery, required: false },
  changedOn: { type: Date, required: true }
 }, {_id: false})


const Order = new mongoose.Schema({
  status: { type: String, required: true },
  customer: { type: mongoose.SchemaTypes.ObjectId, ref: "Customer", required: true },
  requestedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
  receivedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
  delivery: { type: delivery, required: false },
  total_price: { type: Number, require: true },
  createdOn: { type: Date, required: true }
  //   history: [{type: history, required: false}]
  //   createdBy: { type: String, required: true },
});

export default mongoose.model<IOrder>("Order", Order);
