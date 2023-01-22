import Order from "../models/order.model";
import CustomerService from "./customer.service";
import ProductsService from "./products.service";
import { IOrder, IOrderRequest, IOrderResponse } from "../data/types/order.type";
import { Types } from "mongoose";
import { getTotalPrice } from "../utils/utils";
import { ORDER_STATUSES } from "../data/enums";

class OrderService {
  async create(order: IOrderRequest): Promise<IOrderResponse> {
      const requestedProducts = await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
      const newOrder = {
        status: ORDER_STATUSES.DRAFT,
        customer: order.customer,
        requestedProducts,
        delivery: order.delivery || null,
        total_price: getTotalPrice(requestedProducts),
        createdOn: new Date().toISOString()
      };    
      const createdOrder = await Order.create(newOrder);
      const customer = await CustomerService.getCustomer(createdOrder.customer);
      const orderData = Object.assign(createdOrder._doc);
      return { ...orderData, customer };
    }

  async getAll(): Promise<IOrderResponse[]> {
    const ordersFromDB = await Order.find();
    let orders = ordersFromDB.map(async (order) => {
      return {
        ...order._doc,
        customer: await CustomerService.getCustomer(order.customer),
      };
    });
    return Promise.all(orders);
  }

  async getOrder(id: Types.ObjectId): Promise<IOrderResponse> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const orderFromDB = await Order.findById(id);
    if (!orderFromDB) {
      return undefined;
    }
    const customer = await CustomerService.getCustomer(orderFromDB.customer);
    return { ...orderFromDB._doc, customer };
  }

  async update(order: IOrderRequest): Promise<IOrderResponse> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const requestedProducts = await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const newOrder = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer,
      requestedProducts,
      total_price: getTotalPrice(requestedProducts),
    } as Omit<IOrder, "createdOn" | "delivery">
    const updatedOrder = await Order.findByIdAndUpdate(order._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }

  async delete(id: Types.ObjectId): Promise<IOrder> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const order = await Order.findByIdAndDelete(id);
    return order;
  }
}

export default new OrderService();
