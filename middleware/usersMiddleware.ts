import { Request, Response, NextFunction } from "express";
import UsersService from "../services/users.service.js";
import { ROLES } from "../data/enums.js";
import { getUserFromRequest } from "../utils/utils.js";

export async function deleteUserMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("Id was not provided");
    }

    const performer = getUserFromRequest(req);
    const userToDelete = await UsersService.getUser(req.params.id);
    if (userToDelete && userToDelete.roles.includes(ROLES.ADMIN)) {
      return res.status(403).json({ IsSuccess: false, ErrorMessage: "Not allowed to delete admin" });
    }
    if (userToDelete._id.toString() !== performer.id && !performer.roles.includes(ROLES.ADMIN)) {
      return res.status(403).json({ IsSuccess: false, ErrorMessage: "Not allowed to delete user" });
    }

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ IsSuccess: false, ErrorMessage: (e as Error).message });
  }
}
