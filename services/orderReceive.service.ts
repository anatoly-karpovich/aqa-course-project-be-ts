import _ from "lodash";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from "../data/enums";
import type { IOrder, IOrderDocument, ICustomer } from "../data/types";
import Order from "../models/order.model";
import CustomerService from "./customer.service";
import OrderService from "./order.service";
import { getTodaysDate } from "../utils/utils";

class OrderReceiveService {
  async receiveProducts(order: Pick<IOrderDocument, "_id" | "products">): Promise<IOrder<ICustomer>> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const orderFromDB = await OrderService.getOrder(order._id);

    for (const p of order.products) {
      const product = orderFromDB.products.find(el => el._id.toString() === p.toString() && !el.received)
      if(product) product.received = true
    }
    const numberOfReceived = orderFromDB.products.filter(el => el.received).length
    let action: ORDER_HISTORY_ACTIONS
    if(numberOfReceived > 0 && numberOfReceived < orderFromDB.products.length) {
      orderFromDB.status = ORDER_STATUSES.PARTIALLY_RECEIVED;
      action = ORDER_HISTORY_ACTIONS.RECEIVED
    }
    if(numberOfReceived === orderFromDB.products.length) {
      orderFromDB.status = ORDER_STATUSES.RECEIVED;
      action = ORDER_HISTORY_ACTIONS.RECEIVED_ALL
    }
    
    orderFromDB.history.unshift({
      ..._.omit(orderFromDB, ["history", "createdOn", "_id"]),
      customer: orderFromDB.customer._id.toString(),
      changedOn: getTodaysDate(true),
      action
    });
    const updatedOrder = await Order.findByIdAndUpdate(order._id, orderFromDB, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderReceiveService();
