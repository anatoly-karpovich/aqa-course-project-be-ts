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
    const receivedProducts = order.receivedProducts.map(i => i.toString()).map(i => orderFromDb.requestedProducts.find(p => p._id.toString() === i))
    const orderWithReceivedProducts = {
        receivedProducts,
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
