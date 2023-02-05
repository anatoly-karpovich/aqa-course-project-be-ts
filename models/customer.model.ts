import mongoose from "mongoose";
import { COUNTRIES } from "../data/enums";
import { ICustomerDocument } from "../data/types";

const CustomerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  country: { type: String, enum: COUNTRIES, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  house: { type: Number, required: true },
  flat: { type: Number, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: false },
}, { versionKey: false });

export default mongoose.model<ICustomerDocument>("Customer", CustomerSchema);
