import Order from "../models/order.model";
import CustomerService from "./customer.service";
import ProductsService from "./products.service";
import { IOrder, IOrderRequest, IOrderResponse, OrderType } from "../data/types/order.type";
import { Types } from "mongoose";
import { getTotalPrice, getTodaysDate, createHistoryEntry } from "../utils/utils";
import { ORDER_STATUSES } from "../data/enums";
import _ from "lodash";

class OrderService {
  async create(order: IOrderRequest): Promise<IOrderResponse> {
      const requestedProducts = await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
      const newOrder: OrderType = {
        status: ORDER_STATUSES.DRAFT,
        customer: order.customer.toString(),
        requestedProducts,
        notReceivedProducts: requestedProducts,
        delivery: null,
        total_price: getTotalPrice(requestedProducts),
        createdOn: getTodaysDate(),
        receivedProducts: [],
        history: []
      };
      newOrder.history.push(createHistoryEntry(newOrder))

      const createdOrder = await Order.create(newOrder);
      const customer = await CustomerService.getCustomer(createdOrder.customer);
      return { ...createdOrder._doc, customer };
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

    const requestedProducts = await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
    const orderFromDb = await this.getOrder(order._id)
    const newOrder: OrderType = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer.toString(),
      requestedProducts,
      receivedProducts: orderFromDb.receivedProducts,
      delivery: orderFromDb.delivery,
      notReceivedProducts: [...requestedProducts],
      total_price: getTotalPrice(requestedProducts),
      history: orderFromDb.history,
      createdOn: orderFromDb.createdOn
    }
    newOrder.history.push(createHistoryEntry(newOrder)) 

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
