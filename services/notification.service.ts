import { INotification } from "../data/types/notification.types";
import notificationModel from "../models/notification.model";

export class NotificationService {
  private Notification = notificationModel;
  async create({ userId, type, orderId, message }: Pick<INotification, "userId" | "type" | "orderId" | "message">) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 день
    return await this.Notification.create({ userId, type, orderId, message, expiresAt });
  }

  async getNotifications(userId: string) {
    return await this.Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    await this.Notification.findOneAndUpdate({ _id: notificationId, userId }, { read: true }, { new: true });
    return await this.getNotifications(userId);
  }

  async markAllNotificationsAsRead(userId: string) {
    await this.Notification.updateMany({ userId, read: false }, { read: true });
    return await this.getNotifications(userId.toString());
  }
}
