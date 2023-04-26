import mongoose from "mongoose";
import { MANUFACTURERS } from "../data/enums";
import { IProductDocument } from "../data/types";

const ProductSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  manufacturer: { type: String, enum: MANUFACTURERS, required: true },
  createdOn: { type: Date, required: true},
  notes: { type: String, required: false },
}, { versionKey: false });

export default mongoose.model<IProductDocument>("Product", ProductSchema);
