import Order from "../models/order.model";
import CustomerService from "./customer.service";
import _ from "lodash";
import { IOrder, IOrderResponse } from "../data/types/order.type";
import OrderService from "./order.service";

class OrderDeliveryService {
  async updateDelivery(order: Pick<IOrder, "_id" | "delivery">): Promise<IOrderResponse> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const orderFromDB = await OrderService.getOrder(order._id)
    const newOrder = {
      ...orderFromDB,
      delivery: order.delivery,
    };
    newOrder.history.push({
      ..._.omit(newOrder, ['history', 'notReceivedProducts', 'createdOn', '_id']), 
      changedOn: new Date().toISOString()
    })
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderDeliveryService();
