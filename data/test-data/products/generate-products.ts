import { getRandomEnumValue } from "../../../utils/tests-utils";
import { MANUFACTURERS } from "../../enums";
import { IProduct } from "../../types";
import { faker } from "@faker-js/faker";

export function generateNewProduct(customProductFields?: Partial<IProduct>) {
    const product = {
      name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
      price: faker.number.int({ min: 1, max: 99999 }),
      amount: faker.number.int({ min: 0, max: 999 }),
      manufacturer: getRandomEnumValue(MANUFACTURERS),
      notes: faker.string.alpha({ length: { min: 5, max: 250 }, casing: 'mixed' }),
      ...customProductFields,
    } 
    return product;
  };

export function generateProducts(amount: number) {
  return Array.from({ length: amount }).fill(generateNewProduct()) as IProduct[];
}