import mongoose from "mongoose";
import { DELIVERY } from "../data/enums";
import { IOrder } from "../data/types/order.type";

const Order = new mongoose.Schema({
  status: { type: String, required: true },
  customer: { type: mongoose.SchemaTypes.ObjectId, ref: "Customer", required: true },
  requestedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
  receivedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
  delivery: {
    finalDate: { type: Date, required: true },
    condition: { type: String, enum: DELIVERY, required: true },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  total_price: { type: Number, require: true },
//   history: [
//     {
//       status: { type: String, required: true },
//       customer: { type: mongoose.SchemaTypes.ObjectId, ref: "Customer", required: true },
//       requestedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
//       receivedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true }],
//       delivery: {
//         finalDate: { type: Date, required: true },
//         condition: { type: String, required: true },
//         address: {
//           country: { type: String, required: true },
//           city: { type: String, required: true },
//           address: { type: String, required: true },
//         },
//       },
//       changedOn: { type: Date, required: true }
//     },
//   ],
//   createdBy: { type: String, required: true },
//   createdOn: { type: Date, required: true }
});

export default mongoose.model<IOrder>("Order", Order);
