import { Types } from "mongoose";
import type { IProduct } from "../data/types";
import Product from "../models/product.model";

class ProductsService {
  async create(product: IProduct): Promise<IProduct> {
    const createdProduct = await Product.create(product);
    return createdProduct;
  }

  async getAll(): Promise<IProduct[]> {
    const products = await Product.find();
    return products;
  }

  async getProduct(id: Types.ObjectId): Promise<IProduct> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const product = await Product.findById(id);
    return product;
  }

  async update(product: IProduct): Promise<IProduct> {
    if (!product._id) {
      throw new Error("Id was not provided");
    }
    const updatedProduct = await Product.findByIdAndUpdate(product._id, product, { new: true });
    return updatedProduct;
  }

  async delete(id: Types.ObjectId): Promise<IProduct> {
    if (!id) {
      throw new Error("Id was not provided");
    }
    const product = await Product.findByIdAndDelete(id);
    return product;
  }
}

export default new ProductsService();
