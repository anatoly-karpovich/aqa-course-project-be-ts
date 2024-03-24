import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authmiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === "options") {
    next();
  }

  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ IsSuccess: false, ErrorMessage: "Not authorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ IsSuccess: false, ErrorMessage: "Not authorized" });
    }
    const decodedData = jsonwebtoken.verify(token, process.env.SECRET_KEY);
    req["user"] = decodedData;
    next();
  } catch (e: any) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return res.status(401).send({
        IsSuccess: false,
        ErrorMessage: "Access token expired",
      });
    }
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}
