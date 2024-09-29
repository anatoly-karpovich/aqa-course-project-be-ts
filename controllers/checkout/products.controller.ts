import ProductsService from "../../services/products.service.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { createReponse } from "../../utils/utils.js";

class CheckoutProductsController {
  async getAllBy(req: Request, res: Response) {
    try {
      let products = await ProductsService.getAll();
      const sortData = req.body;
      if (sortData.name) {
        products = products.filter((p) => p.name.includes(sortData.name));
      }
      if (sortData.manufacturers.length) {
        products = products.filter((p) => sortData.manufacturers.includes(p.manufacturer));
      }
      return res.json(createReponse(true, null, { Products: products }));
    } catch (e: any) {
      res.status(500).json(createReponse(false, e.message));
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
}

export default new CheckoutProductsController();
