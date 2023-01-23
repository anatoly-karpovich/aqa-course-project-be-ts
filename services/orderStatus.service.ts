import Order from "../models/order.model";
import CustomerService from "./customer.service";
import OrderService from "./order.service";
import _ from 'lodash'
import { IOrder, IOrderResponse } from "../data/types/order.type";

class OrderStatusService {

    async updateStatus(order: Pick<IOrder,"_id" | "status">): Promise<IOrderResponse> {
        if(!order._id) {
            throw new Error( 'Id was not provided') 
        }
        const orderFromDB = await OrderService.getOrder(order._id)
        const newOrder = {
            ...orderFromDB,
            status: order.status
        }
        newOrder.history.push({
            ..._.omit(newOrder, ['history', 'notReceivedProducts', 'createdOn', '_id']), 
            changedOn: new Date().toISOString()
        })
        const updatedOrder = await Order.findByIdAndUpdate(newOrder._id, newOrder, {new: true})
        const customer = await CustomerService.getCustomer(updatedOrder.customer);
        return { ...updatedOrder._doc, customer };
    }
}

export default new OrderStatusService()