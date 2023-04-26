import moment from "moment";
import { DATE_AND_TIME_FORMAT, DATE_FORMAT } from "../data/constants";
import { ORDER_HISTORY_ACTIONS } from "../data/enums";
import type { IHistory, IOrderRequest, IProduct } from "../data/types";
import { IProductInOrder } from "../data/types/order.type";
import ProductsService from "../services/products.service";

export const getTotalPrice = (products: IProduct[]) => {
  return products.reduce((a, b) => {
    a += b.price;
    return a;
  }, 0);
};

export const getTodaysDate = (withTime: boolean) => {
  return withTime 
  ? moment(Date.now()).format(DATE_AND_TIME_FORMAT)
  : moment(Date.now()).format(DATE_FORMAT)
};


export function createHistoryEntry<T extends Omit<IHistory, "changedOn" | "action">>(order: T, action: ORDER_HISTORY_ACTIONS): IHistory {
  return {
    action,
    status: order.status,
    products: order.products,
    customer: order.customer.toString(),
    delivery: order.delivery,
    total_price: order.total_price,
    changedOn: getTodaysDate(true),
  };
}

export async function productsMapping<T extends Pick<IOrderRequest, "products">>(order: T): Promise<IProductInOrder[]> {
  const products = await Promise.all(
    order.products.map(async (id) => {
      return { ...(await ProductsService.getProduct(id))._doc, received: false };
    })
  );
  return products;
}
