import mongoose from "mongoose";
import { COUNTRIES } from "../data/enums";
import { ICustomerDocument } from "../data/types";

export const CustomerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  country: { type: String, enum: COUNTRIES, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: false },
}, { versionKey: false });

export default mongoose.model<ICustomerDocument>("Customer", CustomerSchema);
