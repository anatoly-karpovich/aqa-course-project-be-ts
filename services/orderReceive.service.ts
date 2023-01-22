import mongoose from "mongoose";
import { ORDER_STATUSES } from "../data/enums";
import { IOrderRequest, IOrderResponse } from "../data/types/order.type";
import Order from "../models/order.model";
import CustomerService from "./customer.service";
class OrderReceiveService {
  async receiveProducts(order: Pick<IOrderRequest, "_id" | "receivedProducts">): Promise<IOrderResponse> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const orderFromDb = await Order.findById(order._id);
    const productsToReceive = orderFromDb.requestedProducts.filter((product) => order.receivedProducts.map((i) => i.toString()).includes(product._id.toString()));
    const receivedProducts = [...orderFromDb.receivedProducts, ...productsToReceive];
    const orderWithReceivedProducts = {
      receivedProducts: [...new Set(receivedProducts.map((p) => JSON.stringify(p)))].map((p) => JSON.parse(p)),
      status: orderFromDb.status,
    };
    if (orderWithReceivedProducts.receivedProducts.length && orderWithReceivedProducts.receivedProducts.length < orderFromDb.requestedProducts.length)
      orderWithReceivedProducts.status = ORDER_STATUSES.PARTIALLY_RECEIVED;
    if (orderWithReceivedProducts.receivedProducts.length && orderWithReceivedProducts.receivedProducts.length === orderFromDb.requestedProducts.length)
      orderWithReceivedProducts.status = ORDER_STATUSES.RECEIVED;
    const updatedOrder = await Order.findByIdAndUpdate(order._id, orderWithReceivedProducts, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderReceiveService();
