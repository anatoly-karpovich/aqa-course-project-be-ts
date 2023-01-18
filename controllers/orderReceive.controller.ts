import orderReceiveService from "../services/orderReceive.service.js"
import {Request, Response} from "express"

class OrderReceiveController {
    async receiveProducts(req: Request, res: Response) {
        try {
            const updatedOrder = await orderReceiveService.receiveProducts(req.body)
            return res.status(200).json({Order: updatedOrder, IsSuccess: true, ErrorMessage: null})
        } catch(e: any) {
            res.status(500).json({IsSuccess: false, ErrorMessage: e.message})
        }
    }
}

export default new OrderReceiveController()