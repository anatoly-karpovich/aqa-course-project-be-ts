import cron from "node-cron";
import NotificationModel from "../models/notification.model";

export const startNotificationCleanup = () => {
  // Запуск каждый день в 00:00
  cron.schedule("0 0 * * *", async () => {
    const result = await NotificationModel.deleteMany({ expiresAt: { $lt: new Date() } });
    console.log(`Deleted ${result.deletedCount} expired notifications`);
  });
};
