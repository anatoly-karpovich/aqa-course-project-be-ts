import Order from "../models/order.model";
import CustomerService from "./customer.service";
import _ from "lodash";
import type { IOrder, ICustomer } from "../data/types";
import OrderService from "./order.service";
import { createHistoryEntry } from "../utils/utils";
import { Types } from "mongoose";
import { ORDER_HISTORY_ACTIONS } from "../data/enums";

class OrderDeliveryService {
  async updateDelivery(order: Pick<IOrder<Types.ObjectId>, "_id" | "delivery">): Promise<IOrder<ICustomer>> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    
    const orderFromDB = await OrderService.getOrder(order._id);

    let action = orderFromDB.delivery ? ORDER_HISTORY_ACTIONS.DELIVERY_EDITED : ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      delivery: order.delivery,
    };
    newOrder.history.unshift(createHistoryEntry(newOrder, action));
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);

    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderDeliveryService();
