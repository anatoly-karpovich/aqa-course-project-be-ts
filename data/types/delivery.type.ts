import { COUNTRIES, DELIVERY } from "../enums";

export interface IDelivery {
  finalDate: Date;
  condition: DELIVERY;
  address: {
    country: COUNTRIES;
    city: string;
    address: string;
  };
}
