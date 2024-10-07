import Order from "../models/order.model";
import CustomerService from "./customer.service";
import OrderService from "./order.service";
import _ from "lodash";
import type { IOrder, ICustomer, IComment } from "../data/types";
import { getTodaysDate } from "../utils/utils";
import { Types } from "mongoose";

class OrderCommentsService {
  async createComment(orderId: Types.ObjectId, commentText: string): Promise<IOrder<ICustomer>> {
    if (!orderId) {
      throw new Error("Id was not provided");
    }
    const comment: IComment = {
      text: commentText,
      createdOn: getTodaysDate(true),
    };
    const orderFromDB = await OrderService.getOrder(orderId);
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      comments: [...orderFromDB.comments, comment],
    };

    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }

  // async deleteComment(order: { _id: Types.ObjectId; comments: Pick<IComment, "_id"> }) {
  async deleteComment(orderId: Types.ObjectId, commentId: Types.ObjectId) {
    await Order.updateOne({ _id: orderId }, { $pull: { comments: { _id: commentId } } });
    const updatedOrder = await OrderService.getOrder(orderId);
    const customer = await CustomerService.getCustomer(updatedOrder.customer._id);
    return { ...updatedOrder, customer };
  }
}

export default new OrderCommentsService();
