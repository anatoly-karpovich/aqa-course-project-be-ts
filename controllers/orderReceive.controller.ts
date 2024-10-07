import mongoose from "mongoose";
import orderReceiveService from "../services/orderReceive.service.js";
import { Request, Response } from "express";

class OrderReceiveController {
  async receiveProducts(req: Request, res: Response) {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.id);
      const products = req.body.products;
      const updatedOrder = await orderReceiveService.receiveProducts(orderId, products);
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new OrderReceiveController();
