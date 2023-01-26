import CustomerService from "../services/customer.service";
import { RESPONSE_STATUSES } from "../data/constants.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

class CustomerController {
  async create(req: Request, res: Response) {
    try {
      const customer = await CustomerService.create(req.body);
      res.status(RESPONSE_STATUSES.created).json({ Customer: customer, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(RESPONSE_STATUSES.server_error).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const customer = await CustomerService.getAll();
      return res.json({ Customers: customer, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(RESPONSE_STATUSES.server_error).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async getCustomer(req: Request, res: Response) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const customer = await CustomerService.getCustomer(id);
      return res.json({ Customer: customer, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(RESPONSE_STATUSES.server_error).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedCustomer = await CustomerService.update(req.body);
      return res.json({ Customer: updatedCustomer, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(RESPONSE_STATUSES.server_error).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const customer = await CustomerService.delete(id);
      return res.status(204).json({ Customer: customer, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(RESPONSE_STATUSES.server_error).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new CustomerController();
