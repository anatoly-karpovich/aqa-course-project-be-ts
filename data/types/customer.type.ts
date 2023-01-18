import { COUNTRIES } from "../enums";
import { DocumentResult } from "./document.type";
import mongoose, { Types } from 'mongoose';

export interface ICustomer extends DocumentResult<ICustomer>, mongoose.Document {
    _id?: Types.ObjectId,
    email: string,
    name: string,
    country: COUNTRIES,
    city: string,
    address: string,
    phone: string,
    notes?: string,
}