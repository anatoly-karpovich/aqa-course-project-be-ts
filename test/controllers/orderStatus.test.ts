import { Types } from "mongoose";
import { successResponse, setupErrorResponse } from "../../utils/tests-utils";
import orderStatusService from "../../services/orderStatus.service";
import orderStatusController from "../../controllers/orderStatus.controller";
import { getTokenFromRequest, getDataDataFromToken } from "../../utils/utils";
import { Request, Response } from "express";
import { ROLES } from "../../data/enums";

jest.mock("../../services/orderStatus.service");
jest.mock("../../utils/utils");

describe("Order status controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>, mockUserData, mockUpdatedOrder;

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      params: { id: new Types.ObjectId().toString() },
      headers: { authorization: "Bearer mockToken" },
      body: { status: "testStatus" },
    };

    mockUserData = {
      id: "1",
      roles: ROLES.ADMIN,
      iat: 2,
      exp: 3,
    };

    mockUpdatedOrder = {
      _id: mockRequest.params!.id,
      status: mockRequest.body!.status,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should extract token and user data correctly", async () => {
    (getTokenFromRequest as jest.Mock).mockReturnValue("mockToken");
    (getDataDataFromToken as jest.Mock).mockReturnValue(mockUserData);

    await orderStatusController.update(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(getTokenFromRequest).toHaveBeenCalledWith(mockRequest);
    expect(getDataDataFromToken).toHaveBeenCalledWith("mockToken");
  });

  it("should call updateStatus with correct arguments", async () => {
    (orderStatusService.updateStatus as jest.Mock).mockResolvedValue(
      mockUpdatedOrder
    );

    await orderStatusController.update(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(orderStatusService.updateStatus).toHaveBeenCalledWith(
      new Types.ObjectId(mockRequest.params!.id),
      mockRequest.body?.status,
      mockUserData.id
    );
  });

  it("should return 200 with the updated order", async () => {
    (orderStatusService.updateStatus as jest.Mock).mockResolvedValue(
      mockUpdatedOrder
    );
    (mockResponse.status as jest.Mock).mockReturnValue(mockResponse);

    await orderStatusController.update(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      successResponse({ Order: mockUpdatedOrder })
    );
  });

  it("should return 500 and error", async () => {
    const error = setupErrorResponse(
      orderStatusService.updateStatus,
      "update method error"
    );

    await orderStatusController.update(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error);
  });
});
