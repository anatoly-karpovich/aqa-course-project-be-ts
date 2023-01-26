import _ from "lodash";
import { ORDER_STATUSES } from "../data/enums";
import type { IOrder, IOrderDocument, ICustomer } from "../data/types";
import Order from "../models/order.model";
import { getTodaysDate } from "../utils/utils";
import CustomerService from "./customer.service";
import OrderService from "./order.service";

class OrderReceiveService {
  async receiveProducts(order: Pick<IOrderDocument, "_id" | "receivedProducts">): Promise<IOrder<ICustomer>> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const orderFromDB = await OrderService.getOrder(order._id);
    for (const p of order.receivedProducts) {
      const product = orderFromDB.notReceivedProducts.find((e) => e._id.toString() === p.toString());
      if (product) {
        const start = orderFromDB.notReceivedProducts.findIndex((e) => e._id.toString() === p.toString());
        orderFromDB.notReceivedProducts.splice(start, 1);
        orderFromDB.receivedProducts.push(product);
      } else {
        throw new Error(`Product with id '${p}' is already received`);
      }
    }
    if (orderFromDB.receivedProducts.length && orderFromDB.receivedProducts.length < orderFromDB.requestedProducts.length) orderFromDB.status = ORDER_STATUSES.PARTIALLY_RECEIVED;
    if (orderFromDB.receivedProducts.length && orderFromDB.receivedProducts.length === orderFromDB.requestedProducts.length) orderFromDB.status = ORDER_STATUSES.RECEIVED;
    orderFromDB.history.push({
      ..._.omit(orderFromDB, ["history", "notReceivedProducts", "createdOn", "_id"]),
      customer: orderFromDB.customer._id.toString(),
      changedOn: getTodaysDate(),
    });
    const updatedOrder = await Order.findByIdAndUpdate(order._id, orderFromDB, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderReceiveService();
