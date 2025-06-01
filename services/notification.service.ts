import { Server } from "socket.io";
import { INotification } from "../data/types/notification.types";
import notificationModel from "../models/notification.model";

export class NotificationService {
  private Notification = notificationModel;
  private static io: null | Server = null;

  static setSocketIO(io: Server) {
    NotificationService.io = io;
  }

  static sendToUser(userId: string, data: any) {
    if (NotificationService.io) {
      NotificationService.io.to(userId).emit("new_notification", data);
    }
  }

  async create({ userId, type, orderId, message }: Pick<INotification, "userId" | "type" | "orderId" | "message">) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 день
    const result = await this.Notification.create({ userId, type, orderId, message, expiresAt });
    const notifications = await this.getNotifications(userId);
    NotificationService.sendToUser(userId, {
      message,
      unreadAmount: notifications.filter((n) => !n.read).length,
    });
    return result;
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
