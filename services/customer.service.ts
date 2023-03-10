import Customer from "../models/customer.model";
import type { ICustomer } from "../data/types";
import { Types } from "mongoose";

class CustomerService {
  async create(customer: ICustomer): Promise<ICustomer> {
    const createdCustomer = await Customer.create(customer);
    return createdCustomer;
  }

  async getAll(): Promise<ICustomer[]> {
    const customer = await Customer.find();
    return customer;
  }

  async getCustomer(id: Types.ObjectId): Promise<ICustomer> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const customer = await Customer.findById(id);
    return customer;
  }

  async update(customer: ICustomer): Promise<ICustomer> {
    if (!customer._id) {
      throw new Error("Id was not provided");
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(customer._id, customer, { new: true });
    return updatedCustomer;
  }

  async delete(id: Types.ObjectId): Promise<ICustomer> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const customer = await Customer.findByIdAndDelete(id);
    return customer;
  }
}

export default new CustomerService();
