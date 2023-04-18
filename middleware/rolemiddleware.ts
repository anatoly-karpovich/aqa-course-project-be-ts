import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ROLES } from "../data/enums.js";

export const roleMiddleware = (roles: ROLES) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.method === "options") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ IsSuccess: false, ErrorMessage: "Not authorized" });
      }
      const { roles: userRoles } = jsonwebtoken.verify(token, process.env.SECRET_KEY) as jsonwebtoken.JwtPayload;
      let hashrole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hashrole = true;
        }
      });
      if (!hashrole) {
        return res.status(403).json({ IsSuccess: false, ErrorMessage: "Access denied" });
      }
      next();
    } catch (e: any) {
      console.log(e);
      return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  };
};
