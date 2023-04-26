import Order from "../models/order.model";
import CustomerService from "./customer.service";
import OrderService from "./order.service";
import _ from "lodash";
import type { IOrder, ICustomer } from "../data/types";
import { createHistoryEntry } from "../utils/utils";
import { Types } from "mongoose";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from "../data/enums";

class OrderStatusService {
  async updateStatus(order: Pick<IOrder<Types.ObjectId>, "_id" | "status">): Promise<IOrder<ICustomer>> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const orderFromDB = await OrderService.getOrder(order._id);
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      status: order.status,
    };
    let action: ORDER_HISTORY_ACTIONS
    if(order.status === ORDER_STATUSES.IN_PROCESS) action = ORDER_HISTORY_ACTIONS.PROCESSED
    if(order.status === ORDER_STATUSES.CANCELED) action = ORDER_HISTORY_ACTIONS.CANCELED

    newOrder.history.unshift(createHistoryEntry(newOrder, action));
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderStatusService();
