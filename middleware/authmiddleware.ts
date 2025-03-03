import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Token from "../models/token.model"; // Импорт модели токена
import { getDataDataFromToken, getTokenFromRequest } from "../utils/utils";

export async function authmiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ IsSuccess: false, ErrorMessage: "Not authorized" });
    }

    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ IsSuccess: false, ErrorMessage: "Not authorized" });
    }

    // Проверяем, есть ли этот токен в базе
    const foundToken = await Token.findOne({ token });
    if (!foundToken) {
      return res.status(401).json({ IsSuccess: false, ErrorMessage: "Invalid access token" });
    }

    // Проверяем срок действия токена
    if (new Date() > foundToken.expiresAt) {
      await Token.deleteOne({ token }); // Удаляем истекший токен
      return res.status(401).json({ IsSuccess: false, ErrorMessage: "Access token expired" });
    }

    // Декодируем токен и сохраняем в `req.user`
    const decodedData = getDataDataFromToken(token);
    req["user"] = decodedData;

    // Обновляем срок жизни токена (продлеваем на 24 часа)
    const now = new Date();
    const newExpirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    foundToken.expiresAt = newExpirationDate;
    await foundToken.save();

    next();
  } catch (e: any) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return res.status(401).json({
        IsSuccess: false,
        ErrorMessage: "Access token expired",
      });
    }
    return res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
  }
}
