import Customer from "../models/customer.model";
import type { ICustomer } from "../data/types";
import { Types } from "mongoose";
import { getTodaysDate } from "../utils/utils";

class CustomerService {
  async create(customer: ICustomer): Promise<ICustomer> {
    const createdCustomer = await Customer.create({ ...customer, createdOn: getTodaysDate(true) });
    return createdCustomer;
  }

  async getAll(): Promise<ICustomer[]> {
    const customers = await Customer.find();
    return customers.reverse();
  }

  async getSorted(
    filters: { search: string; country: string[] },
    sortOptions: { sortField: string; sortOrder: string }
  ): Promise<ICustomer[]> {
    const { search, country } = filters;
    let filter: Record<string, any> = {};

    if (country.length > 0) {
      filter.country = { $in: country };
    }
    const searchRegex = new RegExp(search, "i");

    if (search && search.trim() !== "") {
      filter.$or = [
        { email: { $regex: searchRegex } },
        { name: { $regex: searchRegex } },
        { country: { $regex: searchRegex } },
      ];
    }

    const sort: Record<string, 1 | -1> = {};
    if (sortOptions.sortField && sortOptions.sortOrder) {
      sort[sortOptions.sortField] = sortOptions.sortOrder === "asc" ? 1 : -1;
    } else {
      sort["createdOn"] = 1;
    }

    const customers = await Customer.find(filter).sort(sort).exec();
    return customers;
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
