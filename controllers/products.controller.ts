import ProductsService from "../services/products.service.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProductFilters } from "../data/types/product.type.js";

const MIN_LIMIT = 10;
const MAX_LIMIT = 100;

class ProductsController {
  async create(req: Request, res: Response) {
    try {
      const product = await ProductsService.create(req.body);
      res.status(201).json({ Product: product, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async getAllSorted(req: Request, res: Response): Promise<Response> {
    try {
      const {
        search = "",
        sortField = "createdOn",
        sortOrder = "desc",
        page = "1",
        limit = MIN_LIMIT,
      } = req.query as Record<string, string | undefined>;

      const pageNumber = Math.max(parseInt(page), 1);
      const limitNumber = Math.min(Math.max(+limit, MIN_LIMIT), MAX_LIMIT);
      const skip = (pageNumber - 1) * limitNumber;

      const manufacturers = Array.isArray(req.query.manufacturer)
        ? req.query.manufacturer
        : req.query.manufacturer
        ? [req.query.manufacturer]
        : [];

      const filters: IProductFilters = {
        manufacturers: manufacturers as string[],
        search,
      };

      const sortOptions = {
        sortField: sortField as "name" | "price" | "manufacturer" | "createdOn",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const { products, total } = await ProductsService.getSorted(filters, sortOptions, {
        skip,
        limit: limitNumber,
      });

      return res.json({
        Products: products,
        total,
        page: pageNumber,
        limit: limitNumber,
        search,
        manufacturer: manufacturers,
        sorting: sortOptions,
        IsSuccess: true,
        ErrorMessage: null,
      });
    } catch (e: any) {
      return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
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

  async getAll(req: Request, res: Response) {
    try {
      const products = await ProductsService.getAll();
      return res.json({ Products: products, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const updatedProduct = await ProductsService.update({ ...req.body, _id: id });
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
