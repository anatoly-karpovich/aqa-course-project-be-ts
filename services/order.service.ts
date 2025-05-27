import Order from "../models/order.model";
import CustomerService from "./customer.service";
import { IOrder, IOrderRequest, ICustomer } from "../data/types";
import type { Types } from "mongoose";
import { getTotalPrice, createHistoryEntry, productsMapping, getTodaysDate, customSort } from "../utils/utils";
import { NOTIFICATIONS, ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from "../data/enums";
import _ from "lodash";
import mongoose from "mongoose";
import usersService from "./users.service";
import { NotificationService } from "./notification.service";

class OrderService {
  private notificationService = new NotificationService();

  async create(order: IOrderRequest, performerdId: string): Promise<IOrder<ICustomer>> {
    const products = await productsMapping(order);
    const assignedManager = await usersService.getUser(performerdId);
    let action = ORDER_HISTORY_ACTIONS.CREATED;
    const newOrder: IOrder<string> = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer.toString(),
      products,
      delivery: null,
      total_price: getTotalPrice(products),
      createdOn: getTodaysDate(true),
      history: [],
      comments: [],
      assignedManager,
    };
    newOrder.history.unshift(createHistoryEntry(newOrder, action, assignedManager));
    const createdOrder = await Order.create(newOrder);
    const customer = await CustomerService.getCustomer(createdOrder.customer);

    return { ...createdOrder._doc, customer, assignedManager };
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

  async getSorted(
    filters: { search?: string; status?: string[] },
    sortOptions: { sortField: string; sortOrder: string },
    pagination: { skip: number; limit: number }
  ): Promise<{ orders: IOrder<ICustomer>[]; total: number }> {
    const { search = "", status = [] } = filters;
    const { skip, limit } = pagination;

    let ordersFromDB = await Order.find().exec();

    // Джойним кастомеров
    let orders = await Promise.all(
      ordersFromDB.map(async (order) => {
        const customer = await CustomerService.getCustomer(order.customer);
        return {
          ...order._doc,
          customer,
        };
      })
    );

    // Фильтрация
    if (search.trim() !== "") {
      const searchRegex = new RegExp(search, "i");
      const searchNumber = parseFloat(search);

      orders = orders.filter(
        (order) =>
          order._id.toString().match(searchRegex) ||
          order.customer.name.match(searchRegex) ||
          order.customer.email.match(searchRegex) ||
          (!isNaN(searchNumber) && order.total_price === searchNumber) ||
          order.status.match(searchRegex)
      );
    }

    if (status.length > 0) {
      orders = orders.filter((order) => status.includes(order.status));
    }

    const total = orders.length;
    const sorted = customSort(orders, sortOptions);
    const paginated = sorted.slice(skip, skip + limit);

    return { orders: paginated, total };
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
    const assignedManager = await usersService.getUser(orderFromDB.assignedManager as unknown as string);
    return { ...orderFromDB._doc, customer, assignedManager };
  }

  async update(orderId: Types.ObjectId, order: IOrderRequest, performerId: string): Promise<IOrder<ICustomer>> {
    const products = await productsMapping(order);
    const orderFromDb = await this.getOrder(orderId);
    const manager = await usersService.getUser(performerId);
    const newOrder: IOrder<string> = {
      status: ORDER_STATUSES.DRAFT,
      customer: order.customer.toString(),
      products,
      delivery: orderFromDb.delivery,
      total_price: getTotalPrice(products),
      history: orderFromDb.history,
      createdOn: orderFromDb.createdOn,
      comments: orderFromDb.comments,
      assignedManager: orderFromDb.assignedManager,
    };
    let changed = {
      products: false,
      customer: false,
    };
    if (
      !_.isEqual(
        order.products,
        orderFromDb.products.map((p) => p._id.toString())
      )
    ) {
      changed.products = true;
      const o = _.cloneDeep(newOrder);
      o.customer = orderFromDb.customer._id.toString();
      newOrder.history.unshift(createHistoryEntry(o, ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED, manager));
    }
    if (!_.isEqual(order.customer.toString(), orderFromDb.customer._id.toString())) {
      changed.customer = true;
      const o = _.cloneDeep(newOrder);
      o.products = [...orderFromDb.products];
      newOrder.history.unshift(createHistoryEntry(o, ORDER_HISTORY_ACTIONS.CUSTOMER_CHANGED, manager));
    }
    const updatedOrder = await Order.findByIdAndUpdate(orderId, newOrder, { new: true });
    const customer = await CustomerService.getCustomer(updatedOrder.customer);

    if (updatedOrder.assignedManager) {
      if (changed.products) {
        await this.notificationService.create({
          userId: updatedOrder.assignedManager._id.toString(),
          orderId: updatedOrder._id.toString(),
          type: "productsChanged",
          message: NOTIFICATIONS.productsChanged,
        });
      }
      if (changed.customer) {
        await this.notificationService.create({
          userId: updatedOrder.assignedManager._id.toString(),
          orderId: updatedOrder._id.toString(),
          type: "customerChanged",
          message: NOTIFICATIONS.customerChanged,
        });
      }
    }
    return { ...updatedOrder._doc, customer };
  }

  async delete(id: Types.ObjectId): Promise<IOrder<ICustomer>> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const order = await Order.findByIdAndDelete(id);
    const customer = await CustomerService.getCustomer(order.customer);
    return { ...order._doc, customer };
  }

  async getOrdersByCustomer(customerId: string) {
    if (!customerId) {
      throw new Error("Customer ID was not provided");
    }

    // Assuming that the `customer` field in the order contains the customer's ID
    const orders = await Order.find({ customer: customerId });

    return orders;
  }

  async getOrdersByManager(managerId: string) {
    if (!managerId) {
      throw new Error("Manager ID was not provided");
    }

    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      throw new Error("Invalid Manager ID format");
    }

    const orders = await Order.find({ "assignedManager._id": new mongoose.Types.ObjectId(managerId) });

    return orders;
  }
}

export default new OrderService();
