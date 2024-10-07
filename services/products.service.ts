import { Types } from "mongoose";
import type { IProduct } from "../data/types";
import Product from "../models/product.model";
import { getTodaysDate } from "../utils/utils";
import { IProductFilters, IProductSortOptions } from "../data/types/product.type";

class ProductsService {
  async create(product: IProduct): Promise<IProduct> {
    const createdProduct = await Product.create({ ...product, createdOn: getTodaysDate(true) });
    return createdProduct;
  }

  async getSorted(filters: IProductFilters, sortOptions: IProductSortOptions): Promise<IProduct[]> {
    const { manufacturers, search } = filters;
    let filter: Record<string, any> = {};

    if (manufacturers && manufacturers.length > 0) {
      filter.manufacturer = { $in: manufacturers };
    }

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search, "i");
      const searchNumber = parseFloat(search);

      if (!isNaN(searchNumber)) {
        filter.$or = [
          { name: { $regex: searchRegex } },
          { manufacturer: { $regex: searchRegex } },
          { price: searchNumber },
        ];
      }
    }

    const sort: Record<string, 1 | -1> = {};
    if (sortOptions.sortField && sortOptions.sortOrder) {
      sort[sortOptions.sortField] = sortOptions.sortOrder === "asc" ? 1 : -1;
    } else {
      sort["createdOn"] = 1;
    }

    const products = await Product.find(filter).sort(sort).exec();
    return products;
  }

  async getAll() {
    const products = await Product.find();
    return products.reverse();
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
