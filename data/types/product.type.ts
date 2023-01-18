import mongoose, { Types } from "mongoose";
import { DocumentResult } from "./document.type";
import { MANUFACTURER } from "../enums";

export interface IProduct extends mongoose.Document, DocumentResult<IProduct>{
    _id: Types.ObjectId,
    name: string,
    amount: number,
    price: number,
    manufacturer: {type: String, enum: MANUFACTURER, required: true },
    notes?: {type: String, required: false },
}