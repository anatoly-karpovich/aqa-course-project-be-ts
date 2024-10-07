import mongoose from "mongoose";
import OrderStatusService from "../services/orderStatus.service.js";
import { Request, Response } from "express";

class OrderStatusController {
  async update(req: Request, res: Response) {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.id);
      const status = req.body.status;
      const updatedOrder = await OrderStatusService.updateStatus(orderId, status);
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new OrderStatusController();
