import Order from "../models/order.model";
import CustomerService from "./customer.service";
import ProductsService from "./products.service";
import { IOrder, IOrderResponse } from "../data/types/order.type";
import { Types } from "mongoose";
import { getTotalPrice } from "../utils/utils";
import { ORDER_STATUSES } from "../data/enums";

class OrderService {
  async create(order: IOrder): Promise<IOrderResponse> {
    const rp = await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const newOrder = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer,
      requestedProducts: [...order.requestedProducts],
      delivery: order.delivery || null,
      total_price: getTotalPrice(rp),
      createdOn: new Date().toISOString()
    };
    const createdOrder: IOrder = await Order.create(newOrder);
    const customer = await CustomerService.getCustomer(createdOrder.customer);
    const requestedProducts = await Promise.all(createdOrder.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const orderData = Object.assign(createdOrder._doc);
    return { ...orderData, customer, requestedProducts };
  }

  async getAll(): Promise<IOrderResponse[]> {
    const ordersFromDB = await Order.find();
    let orders = ordersFromDB.map(async (order) => {
      return {
        ...order._doc,
        customer: await CustomerService.getCustomer(order.customer),
        requestedProducts: await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc)),
        receivedProducts: await Promise.all(order.receivedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc)),
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
    const requestedProducts = await Promise.all(orderFromDB.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const receivedProducts = await Promise.all(orderFromDB.receivedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    return { ...orderFromDB._doc, customer, requestedProducts, receivedProducts };
  }

  async update(order: IOrder): Promise<IOrderResponse> {
    if (!order._id) {
      throw new Error("Id was not provided");
    }
    const rp = await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const newOrder = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer,
      requestedProducts: [...order.requestedProducts],
      delivery: order.delivery,
      total_price: getTotalPrice(rp),
    } as IOrder;
    const updatedOrder = await Order.findByIdAndUpdate(order._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    const requestedProducts = await Promise.all(updatedOrder.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const receivedProducts = await Promise.all(updatedOrder.receivedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    return { ...updatedOrder._doc, customer, requestedProducts, receivedProducts };
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
