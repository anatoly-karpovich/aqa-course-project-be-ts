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
    const requestedProducts = await Promise.all(updatedOrder.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const receivedProducts = await Promise.all(updatedOrder.receivedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    return { ...updatedOrder._doc, customer, requestedProducts, receivedProducts };
  }
}

export default new OrderDeliveryService();
