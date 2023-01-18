import mongoose from "mongoose";
import { MANUFACTURER } from "../data/enums";
import { IProduct } from "../data/types/product.type";

export const ProductSchema = new mongoose.Schema( {
    name: {type: String, unique: true, required: true},
    amount: {type: Number, required: true},
    price: {type: Number, required: true},
    manufacturer: {type: String, enum: MANUFACTURER, required: true },
    notes: {type: String, required: false },
})

export default mongoose.model<IProduct>('Product', ProductSchema)