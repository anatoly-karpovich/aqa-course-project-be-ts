import mongoose from "mongoose";
import orderDeliveryService from "../services/orderDelivery.service.js";
import { Request, Response } from "express";

class OrderDeliveryController {
  async update(req: Request, res: Response) {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.id);
      const delivery = req.body;
      const updatedOrder = await orderDeliveryService.updateDelivery(orderId, delivery);
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new OrderDeliveryController();
