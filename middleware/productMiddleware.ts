import { isValidInput } from "../utils/validations.js";
import { MANUFACTURERS, VALIDATION_ERROR_MESSAGES } from "../data/enums.js";
import ProductsService from "../services/products.service.js";
import { Request, Response, NextFunction } from "express";
import OrderService from "../services/order.service.js";

export async function productValidations(req: Request, res: Response, next: NextFunction) {
  try {
    if ((await ProductsService.getAll()).find((c) => c.name === req.body.name)) {
      return res.status(409).json({ IsSuccess: false, ErrorMessage: `Product with name '${req.body.name}' already exists` });
    }

    if (!isValidInput("Product Name", req.body.name)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.PRODUCTS_NAME });
    }
    if (!isValidInput("Amount", req.body.amount) && req.body.amount < 0) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.AMOUNT });
    }
    if (!isValidInput("Price", req.body.price) && req.body.price <= 0) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.PRICE });
    }
    if (req.body.notes && !isValidInput("Notes", req.body.notes)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.NOTES });
    }
    if (!Object.values(MANUFACTURERS).includes(req.body.manufacturer)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.MANUFACTURER });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}

export async function productById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id || req.params.id;
    const product = await ProductsService.getProduct(id);
    if (!product) {
      return res.status(404).json({ ErrorMessage: `Product with id '${id}' wasn't found` });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const isAssignedToOrder = (await OrderService.getAll()).some(o => o.requestedProducts.some(r => r._id.toString() === req.params.id));
    if (isAssignedToOrder) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Not allowed to delete product, assigned to the order` });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}
