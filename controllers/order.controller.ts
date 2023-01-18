import OrderService from "../services/order.service.js"
import { RESPONSE_STATUSES } from '../data/constants.js'
import {Request, Response} from "express"
import mongoose from "mongoose"


class OrderController {
    async create(req: Request, res: Response) {
            try {
                const order = await OrderService.create(req.body)
                res.status(RESPONSE_STATUSES.created).json({Order: order, IsSuccess: true, ErrorMessage: null})
        } catch (e: any) {
            res.status(RESPONSE_STATUSES.server_error).json({IsSuccess: false, ErrorMessage: e.message})
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const orders = await OrderService.getAll()
            return res.status(200).json({Orders: orders, IsSuccess: true, ErrorMessage: null})
        } catch(e: any) {
            res.status(RESPONSE_STATUSES.server_error).json({IsSuccess: false, ErrorMessage: e.message})
        }
    }

    async getOrder(req: Request, res: Response) {
        try {
            const id = new mongoose.Types.ObjectId(req.params.id)
            const order = await OrderService.getOrder(id)
            res.status(200).json({Order: order, IsSuccess: true, ErrorMessage: null})
        } catch(e: any) {
            res.status(RESPONSE_STATUSES.server_error).json({IsSuccess: false, ErrorMessage: e.message})
        }
    }

    async update(req: Request, res: Response) {
        try {
            const updatedOrder = await OrderService.update(req.body)
            return res.status(200).json({Order: updatedOrder, IsSuccess: true, ErrorMessage: null})
        } catch(e: any) {
            res.status(RESPONSE_STATUSES.server_error).json({IsSuccess: false, ErrorMessage: e.message})
        }
    }
    
    async delete(req: Request, res: Response) {
        try {
            const id = new mongoose.Types.ObjectId(req.params.id)
            const order = await OrderService.delete(id)
            return res.status(204).json(order)
        } catch(e: any) {
            res.status(RESPONSE_STATUSES.server_error).json({IsSuccess: false, ErrorMessage: e.message})
        }
    }
}

export default new OrderController()