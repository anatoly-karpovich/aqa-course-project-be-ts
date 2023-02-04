import type { IHistory, IOrderRequest, IProduct } from "../data/types";
import ProductsService from "../services/products.service";

export const getTotalPrice = (products: IProduct[]) => {
  return products.reduce((a, b) => {
    a += b.price;
    return a;
  }, 0);
};

export const getTodaysDate = () => {
  return new Date().toISOString();
};

export function createHistoryEntry<T extends Omit<IHistory, "changedOn">>(order: T): IHistory {
  return {
    status: order.status,
    requestedProducts: order.requestedProducts,
    receivedProducts: order.receivedProducts,
    customer: order.customer.toString(),
    delivery: order.delivery,
    total_price: order.total_price,
    changedOn: getTodaysDate()
  };
}

export async function productsMapping<T extends Pick<IOrderRequest, "requestedProducts">> (order: T): Promise<IProduct[]> {
  return await Promise.all(order.requestedProducts.map(async (id) => (await ProductsService.getProduct(id))._doc));
};
