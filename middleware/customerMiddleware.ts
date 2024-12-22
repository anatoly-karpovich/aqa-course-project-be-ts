import { isValidInput } from "../utils/validations.js";
import { VALIDATION_ERROR_MESSAGES, COUNTRIES } from "../data/enums.js";
import CustomerService from "../services/customer.service.js";
import Order from "../models/order.model.js";
import { Request, Response, NextFunction } from "express";

export async function uniqueCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id ?? req.params.id;
    const customer = (await CustomerService.getAll()).find((c) => {
      return id ? c.email === req.body.email && c._id.toString() !== id : c.email === req.body.email;
    });
    if (customer) {
      return res
        .status(409)
        .json({ IsSuccess: false, ErrorMessage: `Customer with email '${req.body.email}' already exists` });
    }
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
  next();
}

export async function customerValidations(req: Request, res: Response, next: NextFunction) {
  try {
    if (
      !isValidInput("Name", req.body.name) ||
      (req.body.name && req.body.name.trim().length !== req.body.name.length)
    ) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    if (
      !isValidInput("City", req.body.city) ||
      (req.body.city && req.body.city.trim().length !== req.body.city.length)
    ) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    if (
      !isValidInput("Street", req.body.street) ||
      (req.body.street && req.body.street.trim().length !== req.body.street.length)
    ) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    if (!isValidInput("House", req.body.house) || req.body.house < 1 || req.body.house > 999) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    if (!isValidInput("Flat", req.body.flat) || req.body.flat < 1 || req.body.flat > 9999) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    if (
      !isValidInput("Email", req.body.email) ||
      (req.body.email && req.body.email.trim().length !== req.body.email.length)
    ) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    if (
      !isValidInput("Phone", req.body.phone) ||
      (req.body.phone && req.body.phone.trim().length !== req.body.phone.length)
    ) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    if (
      !Object.values(COUNTRIES).includes(req.body.country) ||
      (req.body.country && req.body.country.trim().length !== req.body.country.length)
    ) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }
    if (
      req.body.notes &&
      (!isValidInput("Notes", req.body.notes) ||
        req.body.notes.trim().length !== req.body.notes.length ||
        req.body.notes.trim().replaceAll("\r", "").replaceAll("\n", "").length > 250)
    ) {
      return res.status(400).json({ IsSuccess: false, ErrorMessage: VALIDATION_ERROR_MESSAGES.BODY });
    }

    next();
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}

export async function customerById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body._id || req.params.id;
    const customer = await CustomerService.getCustomer(id);
    if (!customer) {
      return res.status(404).json({ IsSuccess: false, ErrorMessage: `Customer with id '${id}' wasn't found` });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await Order.findOne({ customer: req.params.id });
    if (order) {
      return res
        .status(400)
        .json({ IsSuccess: false, ErrorMessage: `Not allowed to delete customer, assigned to the order` });
    }
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}
