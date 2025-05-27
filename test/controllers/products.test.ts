import productsController from "../../controllers/products.controller";
import productsService from "../../services/products.service";
import { Request, Response } from "express";
import { IProduct, IProductFilters } from "../../data/types/product.type";
import { generateNewProduct } from "../../data/test-data/products/generate-products";
import mongoose, { Types } from "mongoose";
import { successResponse, setupErrorResponse } from "../../utils/tests-utils";

jest.mock("../../services/products.service");

describe("Products controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockProduct: Partial<IProduct>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockProduct = generateNewProduct();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create method", () => {
    beforeEach(() => {
      mockRequest = {
        body: { ...mockProduct },
      };
    });

    it("should respond with 201 and created product on success", async () => {
      (productsService.create as jest.Mock).mockResolvedValue(mockProduct);

      await productsController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        successResponse({ Product: mockProduct })
      );
    });

    it("should respond with 500 and error", async () => {
      const error = setupErrorResponse(
        productsService.create,
        "create method error"
      );

      await productsController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll method", () => {
    let sortFields = { sortField: "", sortOrder: "" };
    let filters: IProductFilters = { manufacturers: [], search: "" };
    beforeEach(() => {
      mockRequest = {
        query: { ...filters, ...sortFields },
      };
    });

    it(`should return a product list`, async () => {
      (productsService.getSorted as jest.Mock).mockResolvedValue([mockProduct]);

      await productsController.getAll(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.getSorted).toHaveBeenCalledWith(
        filters,
        sortFields
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        successResponse({
          Products: [mockProduct],
          sorting: { sortField: "", sortOrder: "" },
        })
      );
    });

    it("should respond with 500 and error", async () => {
      const error = setupErrorResponse(
        productsService.getSorted,
        "getAll method error"
      );

      await productsController.getAll(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.getSorted).toHaveBeenCalledWith(
        filters,
        sortFields
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
    });
  });

  describe("getProduct method", () => {
    let mockId: Types.ObjectId;
    beforeEach(() => {
      mockId = new mongoose.Types.ObjectId(1);

      mockRequest = {
        params: { id: mockId.toString() },
      };
    });

    it(`should return product`, async () => {
      (productsService.getProduct as jest.Mock).mockResolvedValue(mockProduct);

      await productsController.getProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.getProduct).toHaveBeenCalledWith(mockId);
      expect(mockResponse.json).toHaveBeenCalledWith(
        successResponse({
          Product: mockProduct,
        })
      );
    });

    it("should respond with 500 status", async () => {
      const error = setupErrorResponse(
        productsService.getProduct,
        "getProduct method error"
      );

      await productsController.getProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.getProduct).toHaveBeenCalledWith(mockId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
    });
  });

  describe("update method", () => {
    let mockId: Types.ObjectId;
    beforeEach(() => {
      mockId = new mongoose.Types.ObjectId(1);

      mockRequest = {
        params: { id: mockId.toString() },
        body: mockProduct,
      };
    });

    it(`should update product`, async () => {
      (productsService.update as jest.Mock).mockResolvedValue(mockProduct);

      await productsController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.update).toHaveBeenCalledWith({
        ...mockProduct,
        _id: mockId,
      });
      expect(mockResponse.json).toHaveBeenCalledWith(
        successResponse({
          Product: mockProduct,
        })
      );
    });

    it("should respond with 500 status", async () => {
      const error = setupErrorResponse(
        productsService.update,
        "update method error"
      );

      await productsController.update(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.update).toHaveBeenCalledWith({
        ...mockProduct,
        _id: mockId,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
    });
  });

  describe("delete method", () => {
    let mockId: Types.ObjectId;
    beforeEach(() => {
      mockId = new mongoose.Types.ObjectId(1);

      mockRequest = {
        params: { id: mockId.toString() },
      };
    });

    it(`should delete product`, async () => {
      (productsService.delete as jest.Mock).mockResolvedValue(mockProduct);

      await productsController.delete(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.delete).toHaveBeenCalledWith(mockId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should respond with 500 status", async () => {
      const error = setupErrorResponse(
        productsService.delete,
        "delete method error"
      );

      await productsController.delete(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(productsService.delete).toHaveBeenCalledWith(mockId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
    });
  });
});
