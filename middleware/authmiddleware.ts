import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authmiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === "options") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ErrorMessage: "Not authorized" });
    }
    const decodedData = jsonwebtoken.verify(token, process.env.SECRET_KEY);
    req["user"] = decodedData;
    next();
  } catch (e: any) {
    console.log(e);
    return res.status(401).json({ ErrorMessage: "Not authorized" });
  }
}
