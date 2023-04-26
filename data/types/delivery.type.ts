import { COUNTRIES, DELIVERY } from "../enums";

export interface IDelivery {
  finalDate: string;
  condition: DELIVERY;
  address: {
    country: COUNTRIES;
    city: string;
    street: string;
    house: number;
    flat: number;
  };
}
