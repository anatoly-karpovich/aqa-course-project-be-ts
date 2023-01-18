import OrderStatusService from "../services/orderStatus.service.js"
import {Request, Response} from "express"


class OrderStatusController {
    async update(req: Request, res: Response) {
        try {
            const updatedOrder = await OrderStatusService.updateStatus(req.body);
            return res.json({Order: updatedOrder, IsSuccess: true, ErrorMessage: null});
          } catch (e: any) {
            res.status(500).json({IsSuccess: false, ErrorMessage: e.message})
          }
    }
}

export default new OrderStatusController()