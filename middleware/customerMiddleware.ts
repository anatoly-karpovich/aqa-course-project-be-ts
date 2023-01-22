import { isValidInput } from "../utils/validations.js";
import { VALIDATION_ERROR_MESSAGES, COUNTRIES, CUSTOMER_REQUIRED_KEYS } from "../data/constants.js";
import CustomerService from "../services/customer.service.js";
import Order from "../models/order.model.js";
import {Request, Response, NextFunction} from 'express'

export async function customerValidations(req: Request, res: Response, next: NextFunction) {
  try {
    for (const key of CUSTOMER_REQUIRED_KEYS) {
      if (!Object.keys(req.body).includes(key)) {
        return res.status(400).json({ IsSuccess: false, ErrorMessage: `Missing '${key}' key` });
      }
    }

    if ((await CustomerService.getAll()).find((c) => c.email === req.body.email)) {
      return res.status(409).json({ IsSuccess: false, ErrorMessage: `Customer with email '${req.body.email}' already exists` });
    }

    if (!isValidInput("Name", req.body.name) || (req.body.name && req.body.name.trim().length !== req.body.name.length)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES["Customer Name"] });
    }

    if (!isValidInput("City", req.body.city) || (req.body.city && req.body.city.trim().length !== req.body.city.length)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES["City"] });
    }

    if (!isValidInput("Address", req.body.address) || (req.body.address && req.body.address.trim().length !== req.body.address.length)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES["Address"] });
    }

    if (!isValidInput("Email", req.body.email) || (req.body.email && req.body.email.trim().length !== req.body.email.length)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES["Email"] });
    }

    if (!isValidInput("Phone", req.body.phone) || (req.body.phone && req.body.phone.trim().length !== req.body.phone.length)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES["Phone"] });
    }

    if (!COUNTRIES.includes(req.body.country) || (req.body.country && req.body.country.trim().length !== req.body.country.length)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES["Country"] });
    }
    if (req.body.notes && (!isValidInput("Notes", req.body.notes) || req.body.notes.trim().length !== req.body.notes.length)) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES["Notes"] });
    }

    next();
  } catch (e: any) {
    console.log(e);
    return res.json({ IsSuccess: false, ErrorMessage: e.message });
  }
}

export async function customerById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id || req.params.id
    const customer = await CustomerService.getCustomer(id);
    if(!customer) {
      return res.status(404).json({ IsSuccess: false, ErrorMessage: `Customer with id '${id}' wasn't found` });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(404).json({ IsSuccess: false, ErrorMessage: `Customer with id '${e.value}' wasn't found` });
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await Order.findOne({customer: req.params.id});
    if(order) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: `Not allowed to delete customer, assigned to the order` });
    }
    next();
  } catch (e: any) {
    console.log(e);
  }
}
