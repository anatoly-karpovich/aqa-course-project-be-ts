import mongoose from "mongoose";
import { ORDER_STATUSES } from "../data/enums";
import { IOrder, IOrderResponse } from "../data/types/order.type";
import Order from "../models/order.model";
import CustomerService from "./customer.service";
import ProductsService from "./products.service";

class OrderReceiveService {

    async receiveProducts(order: Pick<IOrder,"_id" | "receivedProducts">): Promise<IOrderResponse> {
        if(!order._id) {
            throw new Error('Id was not provided') 
        }
        const orderFromDb = await Order.findById(order._id)
        orderFromDb.receivedProducts = [...new Set([...orderFromDb.receivedProducts, ...order.receivedProducts ])]
        if(orderFromDb.receivedProducts.length 
            && orderFromDb.receivedProducts.length < orderFromDb.requestedProducts.length) orderFromDb.status = ORDER_STATUSES.PARTIALLY_RECEIVED
        if(orderFromDb.receivedProducts.length 
            && orderFromDb.receivedProducts.length === orderFromDb.requestedProducts.length) orderFromDb.status = ORDER_STATUSES.RECEIVED
        const updatedOrder = await Order.findByIdAndUpdate(order._id, orderFromDb, {new: true})
        const customer = await CustomerService.getCustomer(updatedOrder.customer);
        const requestedProducts = await Promise.all(updatedOrder.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
        const receivedProducts = await Promise.all(updatedOrder.receivedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
        return { ...updatedOrder._doc, customer, requestedProducts, receivedProducts };
    }
}

export default new OrderReceiveService()