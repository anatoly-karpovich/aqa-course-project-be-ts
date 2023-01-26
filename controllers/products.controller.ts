import ProductsService from "../services/products.service.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

class ProductsController {
  async create(req: Request, res: Response) {
    try {
      const product = await ProductsService.create(req.body);
      res.status(200).json({ Product: product, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const products = await ProductsService.getAll();
      return res.json({ Products: products, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const product = await ProductsService.getProduct(id);
      return res.json({ Product: product, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedProduct = await ProductsService.update(req.body);
      return res.json({ Product: updatedProduct, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const product = await ProductsService.delete(id);
      return res.status(204).json(product);
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new ProductsController();
