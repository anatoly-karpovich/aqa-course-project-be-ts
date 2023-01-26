import OrderService from "../services/order.service.js";
import CustomerService from "../services/customer.service.js";
import ProductsService from "../services/products.service.js";
import { Request, Response, NextFunction } from "express";

import { ORDER_STATUSES } from "../data/enums";

export async function orderById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id || req.params.id;
    const order = await OrderService.getOrder(id);
    if (!order) {
      return res.status(404).json({ IsSuccess: false, ErrorMessage: `Order with id '${id}' wasn't found` });
    }
    next();
  } catch (e) {
    console.log(e);
  }
}

export async function orderValidations(req: Request, res: Response, next: NextFunction) {
  if (!req.body.customer) {
    return res.status(404).json({ IsSuccess: false, ErrorMessage: `Missing customer` });
  }

  if (!req.body.requestedProducts || !req.body.requestedProducts.length) {
    return res.status(404).json({ IsSuccess: false, ErrorMessage: `Missing products` });
  }
  if (req.body.requestedProducts.length > 5) {
    return res.status(404).json({ IsSuccess: false, ErrorMessage: `Incorrect amount of products` });
  }

  try {
    const customer = await CustomerService.getCustomer(req.body.customer);
    if (!customer) {
      return res.status(404).json({ IsSuccess: false, ErrorMessage: `Customer with id '${req.body.customer}' wasn't found` });
    }

    for (const p of req.body.requestedProducts) {
      const product = await ProductsService.getProduct(p);
      if (!product) {
        return res.status(404).json({ IsSuccess: false, ErrorMessage: `Product with id '${p}' wasn't found` });
      }
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ IsSuccess: false, ErrorMessage: `Incorrect request body` });
  }
}

export async function orderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.body.status;
    if (!Object.values(ORDER_STATUSES).includes(status)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Invalid order status` });
    }
    if (status !== "In Process" && status !== "Canceled") {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Invalid order status` });
    }
    const id = req.body._id || req.params.id;
    const order = await OrderService.getOrder(id);
    if (!order) {
      return res.status(404).json({ IsSuccess: false, ErrorMessage: `Order with id '${id}' wasn't found` });
    }
    if (status === "In Process" && order.status !== "Draft" && order.status !== "In Process") {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Invalid order status` });
    }
    if (status === "Canceled" && order.status !== "Draft" && order.status !== "In Process") {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Invalid order status` });
    }

    if (status === "In Process" && !order.delivery) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Can't process order. Please, schedule delivery` });
    }
    next();
  } catch (e) {
    console.log(e);
  }
}

export async function orderUpdateValidations(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id;
    let order = await OrderService.getOrder(req.body._id);
    if (!order) return res.status(404).json({ IsSuccess: false, ErrorMessage: `Order with id '${req.body._id}' wasn't found` });
    if (order.status !== "Draft") {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Invalid order status` });
    }
    next();
  } catch (e) {
    console.log(e);
  }
}

export async function orderReceiveValidations(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderService.getOrder(req.body._id);
    if (!order) {
      return res.status(404).json({ IsSuccess: false, ErrorMessage: `Order with id '${req.body._id}' wasn't found` });
    }

    if (!req.body.receivedProducts.length) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Incorrect amount of received products` });
    }

    if (order.status === "Draft" || order.status === "Received") {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Invalid order status` });
    }

    if (req.body.receivedProducts.length > order.requestedProducts.length) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Incorrect amount of received products` });
    }

    for (const product of req.body.receivedProducts) {
      if (!order.requestedProducts.find((el) => el._id.toString() === product)) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: `Product with Id '${product}' is not requested` });
      }
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}

export async function orderDelivery(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id || req.params.id;
    const order = await OrderService.getOrder(id);
    if (!order) {
      return res.status(404).json({ IsSuccess: false, ErrorMessage: `Order with id '${req.body._id}' wasn't found` });
    }
    if (order.status !== ORDER_STATUSES.DRAFT) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Invalid order status` });
    }
  } catch (e: any) {
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
  next();
}
