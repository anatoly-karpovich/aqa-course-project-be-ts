import OrderService from "../services/order.service.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

class OrderController {
  async create(req: Request, res: Response) {
    try {
      const order = await OrderService.create(req.body);
      res.status(201).json({ Order: order, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const {
        search = "",
        sortField = "createdOn",
        sortOrder = "asc",
      } = req.query as Record<string, string | undefined>;

      const statuses = (
        Array.isArray(req.query.status) ? req.query.status : req.query.status ? [req.query.status] : []
      ) as string[];

      const orders = await OrderService.getSorted({ search, status: statuses }, { sortField, sortOrder });
      return res.status(200).json({ Orders: orders, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      console.log(e);
      return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const order = await OrderService.getOrder(id);
      res.status(200).json({ Order: order, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedOrder = await OrderService.update(req.body);
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const order = await OrderService.delete(id);
      return res.status(204).json({ Order: order, IsSuccess: false, ErrorMessage: null });
    } catch (e: any) {
      console.log(e);
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new OrderController();
