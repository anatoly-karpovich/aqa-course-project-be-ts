import type { IHistory, IOrder, IOrderRequest, IProduct } from "../data/types";
import ProductsService from "../services/products.service";

export const getTotalPrice = (products: IProduct[]) => {
  return products.reduce((a, b) => {
    a += b.price;
    return a;
  }, 0);
};

export const getTodaysDate = () => {
  return new Date().toISOString()
}

export const createHistoryEntry = (order: IOrder<string>): IHistory => {
  return {
        status: order.status,
        requestedProducts: order.requestedProducts,
        receivedProducts: order.receivedProducts,
        customer: order.customer.toString(),
        delivery: order.delivery,
        total_price: order.total_price,
        changedOn: getTodaysDate()
  }
}

export const productsMapping = async (order: IOrderRequest): Promise<IProduct[]> => {
  return await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
}
