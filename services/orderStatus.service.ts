import Order from "../models/order.model";
import CustomerService from "./customer.service";
import OrderService from "./order.service";
import _ from "lodash";
import type { IOrder, ICustomer } from "../data/types";
import { createHistoryEntry } from "../utils/utils";
import { Types } from "mongoose";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from "../data/enums";
import usersService from "./users.service";

class OrderStatusService {
  async updateStatus(orderId: Types.ObjectId, status: string, performerId: string): Promise<IOrder<ICustomer>> {
    if (!orderId) {
      throw new Error("Id was not provided");
    }
    const orderFromDB = await OrderService.getOrder(orderId);
    const manager = await usersService.getUser(performerId);
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      status: status as ORDER_STATUSES,
    };
    let action: ORDER_HISTORY_ACTIONS;
    if (status === ORDER_STATUSES.IN_PROCESS) action = ORDER_HISTORY_ACTIONS.PROCESSED;
    if (status === ORDER_STATUSES.CANCELED) action = ORDER_HISTORY_ACTIONS.CANCELED;

    newOrder.history.unshift(createHistoryEntry(newOrder, action, manager));
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderStatusService();
