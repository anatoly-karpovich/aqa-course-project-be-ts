import { Schema, model, Document } from "mongoose";

export type NotificationType =
  | "assigned"
  | "statusChanged"
  | "customerChanged"
  | "productsChanged"
  | "deliveryUpdated"
  | "productsDelivered"
  | "managerChanged"
  | "commentAdded"
  | "commentDeleted"
  | "newOrder"
  | "unassigned"
  | "assigned";

export interface INotification extends Document {
  userId: string;
  type: NotificationType;
  orderId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}
