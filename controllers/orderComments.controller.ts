import OrderCommentsService from "../services/orderComments.service";
import { Request, Response } from "express";

class OrderCommentsController {
  async create(req: Request, res: Response) {
    try {
      const updatedOrder = await OrderCommentsService.createComment(req.body);
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const updatedOrder = await OrderCommentsService.deleteComment( req.body );
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new OrderCommentsController();
