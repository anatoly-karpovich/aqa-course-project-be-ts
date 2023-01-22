import Order from "../models/order.model";
import CustomerService from "./customer.service";
import ProductsService from "./products.service";
import _ from "lodash";
import { IOrder, IOrderResponse } from "../data/types/order.type";

class OrderDeliveryService {
  async updateDelivery(order: Pick<IOrder, "_id" | "delivery">): Promise<IOrderResponse> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const newOrder: typeof order = {
      _id: order._id,
      delivery: order.delivery,
    };
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderDeliveryService();
