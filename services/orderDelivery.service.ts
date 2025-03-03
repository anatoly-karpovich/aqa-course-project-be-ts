import Order from "../models/order.model";
import CustomerService from "./customer.service";
import _ from "lodash";
import type { IOrder, ICustomer, IDelivery } from "../data/types";
import OrderService from "./order.service";
import { createHistoryEntry } from "../utils/utils";
import { Types } from "mongoose";
import { ORDER_HISTORY_ACTIONS } from "../data/enums";
import usersService from "./users.service";

class OrderDeliveryService {
  async updateDelivery(orderId: Types.ObjectId, delivery: IDelivery, performerId: string): Promise<IOrder<ICustomer>> {
    if (!orderId) {
      throw new Error("Id was not provided");
    }

    const orderFromDB = await OrderService.getOrder(orderId);
    const manager = await usersService.getUser(performerId);

    let action = orderFromDB.delivery
      ? ORDER_HISTORY_ACTIONS.DELIVERY_EDITED
      : ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED;
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      delivery: delivery,
    };
    newOrder.history.unshift(createHistoryEntry(newOrder, action, manager));
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);

    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderDeliveryService();
