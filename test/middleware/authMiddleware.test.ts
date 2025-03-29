import { Request, Response, NextFunction } from "express";
import { getTokenFromRequest, getDataDataFromToken } from "../../utils/utils";
import { authmiddleware } from "../../middleware/authmiddleware";
import { errorResponse } from "../../utils/tests-utils";
import { ERROR_MESSAGES } from "../../data/test-data/errorMessages";
import Token from "../../models/token.model";
import { ROLES } from "../../data/enums";
import { TokenExpiredError } from "jsonwebtoken";

jest.mock("../../utils/utils", () => ({
  getTokenFromRequest: jest.fn(),
  getDataDataFromToken: jest.fn(),
}));

jest.mock("../../models/token.model", () => ({
  findOne: jest.fn(),
  deleteOne: jest.fn(),
}));

describe("Authmiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get 401 code and Not authorized message in response without authorization header in request", async () => {
    mockRequest = {
      headers: {},
    };

    await authmiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      errorResponse(ERROR_MESSAGES.NOT_AUTHORIZED)
    );
  });

  it("should get 401 if token is missing", async () => {
    mockRequest = {
      headers: { authorization: "Bearer " },
    };
    (getTokenFromRequest as jest.Mock).mockReturnValue(null);

    await authmiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      errorResponse(ERROR_MESSAGES.NOT_AUTHORIZED)
    );
  });

  it("should get 401 if token is not found in the database", async () => {
    mockRequest = {
      headers: { authorization: "Bearer valid_token" },
    };
    (getTokenFromRequest as jest.Mock).mockReturnValue("valid_token");
    (Token.findOne as jest.Mock).mockResolvedValue(null);

    await authmiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next
    );

    expect(Token.findOne).toHaveBeenCalledWith({ token: "valid_token" });
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      errorResponse(ERROR_MESSAGES.INVALID_ACCESS_TOKEN)
    );
  });

  it("should get 401 if token is expired", async () => {
    mockRequest = {
      headers: { authorization: "Bearer expired_token" },
    };
    (getTokenFromRequest as jest.Mock).mockReturnValue("expired_token");
    (Token.findOne as jest.Mock).mockResolvedValue({ token: "expired_token" });
    (getDataDataFromToken as jest.Mock).mockImplementation(() => {
      throw new Error("Access token expired");
    });

    await authmiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next
    );

    expect(Token.deleteOne).toHaveBeenCalledWith({ token: "expired_token" });
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      errorResponse(ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED)
    );
  });

  it("should call next() if the token is valid", async () => {
    mockRequest = {
      headers: { authorization: "Bearer valid_token" },
    };

    const userData = { id: 1, roles: ROLES.ADMIN, iat: 321, exp: 444 };
    (getTokenFromRequest as jest.Mock).mockReturnValue("valid_token");
    (Token.findOne as jest.Mock).mockResolvedValue({
      token: "valid_token",
      expiresAt: new Date(),
      userId: 1,
      save: jest.fn(),
    });
    (getDataDataFromToken as jest.Mock).mockReturnValue(userData);

    await authmiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next
    );

    expect(mockRequest["user"]).toEqual(userData);
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 and Access token expired message when TokenExpiredError is thrown", async () => {
    mockRequest = {
      headers: { authorization: "Bearer valid_token" },
    };

    const date = new Date();
    (getTokenFromRequest as jest.Mock).mockReturnValue("valid_token");
    (Token.findOne as jest.Mock).mockResolvedValue({
      token: "valid_token",
      expiresAt: 3323423433,
      userId: 1,
      save: jest.fn(),
    });
    (getDataDataFromToken as jest.Mock).mockImplementation(() => {
      throw new TokenExpiredError("expired", new Date());
    });

    await authmiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      errorResponse(ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED)
    );
  });

  it("should return 500 and stack trace error message", async () => {
    mockRequest = {
      headers: { authorization: "Bearer valid_token" },
    };

    (getTokenFromRequest as jest.Mock).mockReturnValue("valid_token");
    (Token.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("authmiddleware");
    });

    await authmiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      errorResponse("authmiddleware")
    );
  });
});
