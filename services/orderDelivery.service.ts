import Order from "../models/order.model";
import CustomerService from "./customer.service";
import _ from "lodash";
import type { IOrder, ICustomer } from "../data/types";
import OrderService from "./order.service";
import { createHistoryEntry } from "../utils/utils";
import { Types } from "mongoose";

class OrderDeliveryService {
  async updateDelivery(order: Pick<IOrder<Types.ObjectId>, "_id" | "delivery">): Promise<IOrder<ICustomer>> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const orderFromDB = await OrderService.getOrder(order._id);
    const newOrder: IOrder<string> = {
      ...orderFromDB,
      customer: orderFromDB.customer._id.toString(),
      delivery: order.delivery,
    };
    newOrder.history.push(createHistoryEntry(newOrder));
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);

    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderDeliveryService();
