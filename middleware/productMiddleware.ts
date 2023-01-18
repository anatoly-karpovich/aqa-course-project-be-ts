import { isValidInput } from "../utils/validations.js";
import { VALIDATION_ERROR_MESSAGES, MANUFACTURERS } from "../data/constants.js";
import ProductsService from "../services/products.service.js";
import Order from "../models/order.model.js";
import {Request, Response, NextFunction} from 'express'



export function productValidations(req: Request, res: Response, next: NextFunction) {
  try {
    if (!isValidInput("Product Name", req.body.name)) {
      return res.status(400).json({ ErrorMessage: VALIDATION_ERROR_MESSAGES["Product Name"] });
    }
    if (!isValidInput("Amount", req.body.amount) && req.body.amount < 0) {
      return res.status(400).json({ ErrorMessage: VALIDATION_ERROR_MESSAGES["Amount"] });
    }
    if (!isValidInput("Price", req.body.price) && req.body.price <= 0) {
      return res.status(400).json({ ErrorMessage: VALIDATION_ERROR_MESSAGES["Price"] });
    }
    if (req.body.notes && !isValidInput("Notes", req.body.notes)) {
        return res.status(400).json({ ErrorMessage: VALIDATION_ERROR_MESSAGES["Notes"] });
    }
    if (!MANUFACTURERS.includes(req.body.manufacturer)) {
      return res.status(400).json({ ErrorMessage: VALIDATION_ERROR_MESSAGES["Manufacturer"] });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(401).json({ ErrorMessage: e.message });
  }
}

export async function productById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id || req.params.id
    const product = await ProductsService.getProduct(id);
    if(!product) {
      return res.status(404).json({ ErrorMessage: `Product with id '${id}' wasn't found` });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(404).json({ ErrorMessage: `Product with id '${e.value}' wasn't found` });
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await Order.find({ requestedProducts: req.params.id })
    if(order.length) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Not allowed to delete product, assigned to the order` });
    }
    next();
  } catch (e) {
    console.log(e);
  }
}
