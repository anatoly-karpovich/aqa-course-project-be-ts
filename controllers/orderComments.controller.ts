import mongoose from "mongoose";
import OrderCommentsService from "../services/orderComments.service";
import { Request, Response } from "express";
import { getTokenFromRequest, getDataDataFromToken } from "../utils/utils";

class OrderCommentsController {
  async create(req: Request, res: Response) {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.id);
      const comment = req.body.comment as string;
      const token = getTokenFromRequest(req);
      const userData = getDataDataFromToken(token);
      const updatedOrder = await OrderCommentsService.createComment(orderId, comment, userData.id);
      return res.status(200).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const orderId = new mongoose.Types.ObjectId(req.params.id);
      const commentId = new mongoose.Types.ObjectId(req.params.commentId);
      const updatedOrder = await OrderCommentsService.deleteComment(orderId, commentId);
      return res.status(204).json({ Order: updatedOrder, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new OrderCommentsController();
