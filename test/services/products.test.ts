import { customSort, getTodaysDate } from "../../utils/utils";
import Product from "../../models/product.model";
import { IProduct } from "../../data/types";
import { generateNewProduct } from "../../data/test-data/products/generate-products";
import productsService from "../../services/products.service";
import { IProductFilters } from "../../data/types/product.type";
import { MANUFACTURERS } from "../../data/enums";
import { Types } from "mongoose";
import { ERROR_MESSAGES } from "../../data/test-data/errorMessages";

jest.mock("../../utils/utils", () => ({
  customSort: jest.fn(),
  getTodaysDate: jest.fn(),
}));

jest.mock("../../models/product.model", () => ({
  create: jest.fn(),
  find: jest.fn(() => ({
    exec: jest.fn(),
  })),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

describe("Products service", () => {
  let testProduct: Partial<IProduct>;

  beforeEach(() => {
    testProduct = generateNewProduct();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create method", () => {
    it('should call "create" service method and return created product', async () => {
      const date = "2025/02/23 12:33:01";
      const product = { ...testProduct };
      const expectedProduct = {
        ...product,
        createdOn: date,
        _id: "test-id-123",
      };
      (getTodaysDate as jest.Mock).mockReturnValue(date);
      (Product.create as jest.Mock).mockResolvedValue(expectedProduct);

      const createdProduct = await productsService.create(
        testProduct as IProduct
      );

      expect(Product.create).toHaveBeenCalledWith({
        ...product,
        createdOn: date,
      });
      expect(createdProduct).toEqual(expectedProduct);
    });
  });

  describe("getSorted method", () => {
    it("should return sorted products with manufacturer filter", async () => {
      const filters: IProductFilters = {
        manufacturers: [MANUFACTURERS.Apple, MANUFACTURERS.Samsung],
        search: "",
      };
      const sortOptions = { sortField: "price", sortOrder: "asc" };
      const mockProducts = [
        generateNewProduct({
          price: 222,
          manufacturer: MANUFACTURERS.Samsung,
          _id: new Types.ObjectId(1),
        }),
        generateNewProduct({
          price: 111,
          manufacturer: MANUFACTURERS.Apple,
          _id: new Types.ObjectId(2),
        }),
      ];
      const sortedProducts = [...mockProducts].reverse();

      const mockExec = jest.fn().mockResolvedValue(mockProducts);
      (Product.find as jest.Mock).mockReturnValue({ exec: mockExec });
      (customSort as jest.Mock).mockReturnValue(sortedProducts);

      const result = await productsService.getSorted(filters, sortOptions);

      expect(Product.find).toHaveBeenCalledWith({
        manufacturer: { $in: [MANUFACTURERS.Apple, MANUFACTURERS.Samsung] },
      });
      expect(mockExec).toHaveBeenCalled();
      expect(customSort).toHaveBeenCalledWith(mockProducts, sortOptions);
      expect(result).toEqual(sortedProducts);
    });

    it("should return sorted products with text search filter", async () => {
      const filters: IProductFilters = {
        manufacturers: [],
        search: "iphone",
      };
      const sortOptions = { sortField: "name", sortOrder: "desc" };
      const mockProducts = [
        generateNewProduct({
          name: "iPhone 13",
          _id: new Types.ObjectId(1),
        }),
        generateNewProduct({
          name: "iPhone 12",
          _id: new Types.ObjectId(2),
        }),
      ];
      const sortedProducts = [...mockProducts];

      const mockExec = jest.fn().mockResolvedValue(mockProducts);
      (Product.find as jest.Mock).mockReturnValue({ exec: mockExec });
      (customSort as jest.Mock).mockReturnValue(sortedProducts);

      const result = await productsService.getSorted(filters, sortOptions);

      expect(Product.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: /iphone/i } },
          { manufacturer: { $regex: /iphone/i } },
        ],
      });
      expect(mockExec).toHaveBeenCalled();
      expect(customSort).toHaveBeenCalledWith(mockProducts, sortOptions);
      expect(result).toEqual(sortedProducts);
    });

    it("should handle numeric search filter", async () => {
      const filters: IProductFilters = {
        manufacturers: [],
        search: "999",
      };
      const sortOptions = { sortField: "price", sortOrder: "asc" };
      const mockProducts = [
        generateNewProduct({
          price: 999,
          _id: new Types.ObjectId(1),
        }),
      ];

      const mockExec = jest.fn().mockResolvedValue(mockProducts);
      (Product.find as jest.Mock).mockReturnValue({ exec: mockExec });
      (customSort as jest.Mock).mockReturnValue(mockProducts);

      const result = await productsService.getSorted(filters, sortOptions);

      expect(Product.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: /999/i } },
          { manufacturer: { $regex: /999/i } },
          { price: 999 },
        ],
      });
      expect(mockExec).toHaveBeenCalled();
      expect(customSort).toHaveBeenCalledWith(mockProducts, sortOptions);
      expect(result).toEqual(mockProducts);
    });

    it("should handle combine manufacturer and search filter", async () => {
      const filters: IProductFilters = {
        manufacturers: [MANUFACTURERS.Amazon],
        search: "test",
      };
      const sortOptions = { sortField: "name", sortOrder: "asc" };
      const mockProducts = [
        generateNewProduct({
          name: "Product test",
          price: 999,
          manufacturer: MANUFACTURERS.Amazon,
          _id: new Types.ObjectId(1),
        }),
      ];

      const mockExec = jest.fn().mockResolvedValue(mockProducts);
      (Product.find as jest.Mock).mockReturnValue({ exec: mockExec });
      (customSort as jest.Mock).mockReturnValue(mockProducts);

      const result = await productsService.getSorted(filters, sortOptions);

      expect(Product.find).toHaveBeenCalledWith({
        manufacturer: { $in: [MANUFACTURERS.Amazon] },
        $or: [
          { name: { $regex: /test/i } },
          { manufacturer: { $regex: /test/i } },
        ],
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getAll method", () => {
    it("should return all products", async () => {
      const mockProducts = [
        generateNewProduct({ _id: new Types.ObjectId(1) }),
        generateNewProduct({ _id: new Types.ObjectId(2) }),
      ];
      const reversedProducts = [...mockProducts].reverse();

      (Product.find as jest.Mock).mockReturnValue(mockProducts);

      const result = await productsService.getAll();

      expect(Product.find).toHaveBeenCalled();
      expect(result).toEqual(reversedProducts);
    });

    it("should return empty array if nothing found", async () => {
      (Product.find as jest.Mock).mockReturnValue([]);

      const result = await productsService.getAll();

      expect(Product.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("getProduct method", () => {
    it("should throw an error when product id was not provided", async () => {
      await expect(
        productsService.getProduct(null as unknown as Types.ObjectId)
      ).rejects.toThrow(ERROR_MESSAGES.ID_WAS_NOT_PROVIDED);
      expect(Product.findById).not.toHaveBeenCalled();
    });

    it("should return product by id", async () => {
      const id = new Types.ObjectId(1);
      const product = { _id: id, ...generateNewProduct() };
      (Product.findById as jest.Mock).mockResolvedValue(product);

      const resutl = await productsService.getProduct(id);

      expect(Product.findById).toHaveBeenCalledWith(id);
      expect(resutl).toEqual(product);
    });

    it("should return null when product was not found", async () => {
      const id = new Types.ObjectId();
      (Product.findById as jest.Mock).mockResolvedValue(null);

      const result = await productsService.getProduct(id);

      expect(Product.findById).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe("update method", () => {
    it("should update product and return updated product", async () => {
      const id = new Types.ObjectId(1);
      const productToUpdate = generateNewProduct({
        _id: id,
      }) as IProduct;

      const updatedProduct = {
        ...productToUpdate,
        name: "Updated Product",
        price: 1099,
      };
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedProduct
      );

      const result = await productsService.update(productToUpdate);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        productToUpdate,
        { new: true }
      );
      expect(result).toEqual(updatedProduct);
    });

    it("should throw an error if product id was not provided", async () => {
      const productWithoutId = {
        name: "Product",
        price: 999,
      } as IProduct;

      await expect(productsService.update(productWithoutId)).rejects.toThrow(
        ERROR_MESSAGES.ID_WAS_NOT_PROVIDED
      );
      expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe("delete method", () => {
    it("should delete product by id and return deleted product", async () => {
      const id = new Types.ObjectId();
      const deletedProduct = generateNewProduct({
        _id: id,
        name: "Deleted Product",
      });
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(
        deletedProduct
      );

      const result = await productsService.delete(id);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedProduct);
    });

    it("should throw an error if id was not provided", async () => {
      await expect(
        productsService.delete(null as unknown as Types.ObjectId)
      ).rejects.toThrow(ERROR_MESSAGES.ID_WAS_NOT_PROVIDED);
      expect(Product.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("should return null when product to delete is not found", async () => {
      const id = new Types.ObjectId();
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await productsService.delete(id);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });
});
