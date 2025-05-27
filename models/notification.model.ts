import { INotification } from "../data/types/notification.types";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    orderId: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<INotification>("Notification", notificationSchema);
