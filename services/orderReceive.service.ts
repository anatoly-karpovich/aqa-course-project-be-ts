import _ from "lodash";
import { ORDER_STATUSES } from "../data/enums";
import { IOrder, IOrderResponse } from "../data/types/order.type";
import Order from "../models/order.model";
import CustomerService from "./customer.service";
class OrderReceiveService {
  async receiveProducts(order: Pick<IOrder, "_id" | "receivedProducts">): Promise<IOrderResponse> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const orderFromDb = await Order.findById(order._id);
    for(const p of order.receivedProducts) {
        const product = orderFromDb.notReceivedProducts.find(e => e._id.toString() === p.toString())
        if(product) {
            const start = orderFromDb.notReceivedProducts.findIndex(e => e._id.toString() === p.toString())
            orderFromDb.notReceivedProducts.splice(start,1)
            orderFromDb.receivedProducts.push(product)
        } else {
            throw new Error(`Product with id '${p}' is already received`)
        }
    }
    if (orderFromDb.receivedProducts.length && orderFromDb.receivedProducts.length < orderFromDb.requestedProducts.length)
    orderFromDb.status = ORDER_STATUSES.PARTIALLY_RECEIVED;
    if (orderFromDb.receivedProducts.length && orderFromDb.receivedProducts.length === orderFromDb.requestedProducts.length)
    orderFromDb.status = ORDER_STATUSES.RECEIVED;
    orderFromDb.history.push({
        ..._.omit(orderFromDb, ['history', 'notReceivedProducts', 'createdOn', '_id']), 
        changedOn: new Date().toISOString()
    })
    const updatedOrder = await Order.findByIdAndUpdate(order._id, orderFromDb, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }
}

export default new OrderReceiveService();
