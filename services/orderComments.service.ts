import Order from "../models/order.model";
import CustomerService from "./customer.service";
import OrderService from "./order.service";
import _ from "lodash";
import type { IOrder, ICustomer, IComment } from "../data/types";
import { getTodaysDate } from "../utils/utils";
import { Types } from "mongoose";
import { NOTIFICATIONS } from "../data/enums";
import { NotificationService } from "./notification.service";
import usersService from "./users.service";

class OrderCommentsService {
  private notificationService = new NotificationService();

  async createComment(orderId: Types.ObjectId, commentText: string, performerId: string): Promise<IOrder<ICustomer>> {
    if (!orderId) {
      throw new Error("Id was not provided");
    }
    const user = await usersService.getUser(performerId);
    const createdBy = user.firstName + " " + user.lastName;
    const comment: IComment = {
      text: commentText,
      createdOn: new Date(),
      createdBy,
    };
    const orderFromDB = await OrderService.getOrder(orderId);
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      comments: [...orderFromDB.comments, comment],
    };

    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);

    if (updatedOrder.assignedManager) {
      await this.notificationService.create({
        userId: updatedOrder.assignedManager._id.toString(),
        orderId: updatedOrder._id.toString(),
        type: "commentAdded",
        message: NOTIFICATIONS.commentAdded,
      });
    }
    return { ...updatedOrder._doc, customer };
  }

  async deleteComment(orderId: Types.ObjectId, commentId: Types.ObjectId) {
    await Order.updateOne({ _id: orderId }, { $pull: { comments: { _id: commentId } } });
    const updatedOrder = await OrderService.getOrder(orderId);
    const customer = await CustomerService.getCustomer(updatedOrder.customer._id);
    if (updatedOrder.assignedManager) {
      await this.notificationService.create({
        userId: updatedOrder.assignedManager._id.toString(),
        orderId: updatedOrder._id.toString(),
        type: "commentDeleted",
        message: NOTIFICATIONS.commentDeleted,
      });
    }
    return { ...updatedOrder, customer };
  }
}

export default new OrderCommentsService();
