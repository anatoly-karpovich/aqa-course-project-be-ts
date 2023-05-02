import Order from "../models/order.model";
import CustomerService from "./customer.service";
import { IOrder, IOrderRequest, ICustomer } from "../data/types";
import type { Types } from "mongoose";
import { getTotalPrice, createHistoryEntry, productsMapping, getTodaysDate } from "../utils/utils";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from "../data/enums";
import _ from "lodash";

class OrderService {
  async create(order: IOrderRequest): Promise<IOrder<ICustomer>> {
    const products = await productsMapping(order);
    let action = ORDER_HISTORY_ACTIONS.CREATED 
    const newOrder: IOrder<string> = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer.toString(),
      products,
      delivery: null,
      total_price: getTotalPrice(products),
      createdOn: getTodaysDate(true),
      history: [],
      comments: [],
    };
    newOrder.history.unshift(createHistoryEntry(newOrder, action));
    const createdOrder = await Order.create(newOrder);
    const customer = await CustomerService.getCustomer(createdOrder.customer);
    return { ...createdOrder._doc, customer };
  }

  async getAll(): Promise<IOrder<ICustomer>[]> {
    const ordersFromDB = await Order.find();
    let orders = ordersFromDB.map(async (order) => {
      return {
        ...order._doc,
        customer: await CustomerService.getCustomer(order.customer),
      };
    });
    return (await Promise.all(orders)).reverse();
  }

  async getOrder(id: Types.ObjectId): Promise<IOrder<ICustomer>> {
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

  async update(order: IOrderRequest): Promise<IOrder<ICustomer>> {
    const products = await productsMapping(order);
    const orderFromDb = await this.getOrder(order._id);
    const newOrder: IOrder<string> = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer.toString(),
      products,
      delivery: orderFromDb.delivery,
      total_price: getTotalPrice(products),
      history: orderFromDb.history,
      createdOn: orderFromDb.createdOn,
      comments: orderFromDb.comments,
    };
    if(!_.isEqual(order.products, orderFromDb.products.map(p => p._id.toString()))) {
      const o = _.cloneDeep(newOrder)
      o.customer = orderFromDb.customer._id.toString()
      newOrder.history.unshift(createHistoryEntry(o, ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED));
    };
    if(!_.isEqual(order.customer.toString(), orderFromDb.customer._id.toString())) {
      const o = _.cloneDeep(newOrder)
      o.products = [...orderFromDb.products]
      newOrder.history.unshift(createHistoryEntry(o, ORDER_HISTORY_ACTIONS.CUSTOMER_CHANGED));
    };
    const updatedOrder = await Order.findByIdAndUpdate(order._id, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);
    return { ...updatedOrder._doc, customer };
  }

  async delete(id: Types.ObjectId): Promise<IOrder<ICustomer>> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const order = await Order.findByIdAndDelete(id);
    const customer = await CustomerService.getCustomer(order.customer);
    return { ...order._doc, customer }
  }
}

export default new OrderService();
