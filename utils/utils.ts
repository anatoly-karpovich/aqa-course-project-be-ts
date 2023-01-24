import { IHistory, OrderType } from "../data/types/order.type";
import { IProduct } from "../data/types/product.type";

export const getTotalPrice = (products: IProduct[]) => {
  return products.reduce((a, b) => {
    a += b.price;
    return a;
  }, 0);
};

export const getTodaysDate = () => {
  return new Date().toISOString()
}

export const createHistoryEntry = (order: OrderType): IHistory => {
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
