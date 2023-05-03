import Order from "../models/order.model";
import CustomerService from "./customer.service";
import OrderService from "./order.service";
import _ from "lodash";
import type { IOrder, ICustomer, IComment } from "../data/types";
import { getTodaysDate } from "../utils/utils";
import { Types } from "mongoose";

class OrderCommentsService {
  async createComment(order: { _id: Types.ObjectId, comments: Pick<IComment, "text"> }): Promise<IOrder<ICustomer>> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const comment: IComment = { 
      text: order.comments.text,
      createdOn: getTodaysDate(true) 
    }
    const orderFromDB = await OrderService.getOrder(order._id);
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      comments: [...orderFromDB.comments, comment]
    };

    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }

  async deleteComment(order: { _id: Types.ObjectId, comments: Pick<IComment, "_id"> }) {
    await Order.updateOne({_id: order._id}, { $pull: {comments: {_id: order.comments._id}}})
    const updatedOrder = await OrderService.getOrder(order._id);
    const customer = await CustomerService.getCustomer(updatedOrder.customer._id);
    return { ...updatedOrder, customer }
  }
}

export default new OrderCommentsService();
