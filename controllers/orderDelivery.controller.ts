import orderDeliveryService from "../services/orderDelivery.service.js";
import { Request, Response } from "express";

class OrderDeliveryController {
  async update(req: Request, res: Response) {
    try {
      const updatedOrder = await orderDeliveryService.updateDelivery(req.body);
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new OrderDeliveryController();
