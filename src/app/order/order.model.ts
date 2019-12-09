import { Product, IProduct } from '../product/product.model';
// import { Picture } from '../picture.model';
import { Address, IMerchant } from '../entity.model';
import { ILocation } from '../location/location.model';

export enum OrderType {
  FOOD_DELIVERY = 1,
  TELECOMMUNICATIONS
}

export interface IOrder {
  _id?: string;          // in db
  code?: string;         // in db (optional)
  clientId: string;      // in db
  clientName: string;    // in db
  merchantId: string;    // in db
  merchantName: string;  // in db
  merchant?: IMerchant;
  location: ILocation;   // all telecomunication order use DEFALT_ADDRESS to generate order code
  paymentMethod: string; // in db
  type?: OrderType;      // in db
  status: string;        // in db
  note?: string;         // in db (optional)
  address?: string;      // in db (optional)
  items?: IOrderItem[];       // in db
  deliveryAddress?: Address;  // in db (optional)
  deliveryFee?: number;       // in db (optional)
  deliveryDiscount?: number;  // in db (optional)
  price: number;            // in db
  cost: number;             // in db
  tax: number;              // in db
  total: number;            // in db
  delivered?: string;       // in db (optional)
  created?: string;         // in db (optional)
  modified?: string;        // in db (optional)
}

export class Order implements IOrder {
  _id?: string;          // in db
  code?: string;         // in db (optional)
  clientId: string;      // in db
  clientName: string;    // in db
  merchantId: string;    // in db
  merchantName: string;  // in db
  merchant?: IMerchant;
  location: ILocation;   // all telecomunication order use DEFALT_ADDRESS to generate order code
  paymentMethod: string; // in db
  type?: OrderType;      // in db
  status: string;        // in db
  note?: string;         // in db (optional)
  address?: string;      // in db (optional)
  items?: IOrderItem[];       // in db
  deliveryAddress?: Address;  // in db (optional)
  deliveryFee?: number;       // in db (optional)
  deliveryDiscount?: number;  // in db (optional)
  price: number;            // in db
  cost: number;             // in db
  tax: number;              // in db
  total: number;            // in db
  delivered?: string;       // in db (optional)
  created?: string;         // in db (optional)
  modified?: string;        // in db (optional)

  constructor(data?: IOrder) {
    Object.assign(this, data);
  }
}

export interface IOrderItem {
  productId: string;    // in db
  price: number;        // in db
  cost: number;         // in db
  quantity: number;     // in db
}

export class OrderItem implements IOrderItem {
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  price: number;
  cost: number;
  quantity: number;
  constructor(data?: IOrderItem) {
    Object.assign(this, data);
  }
}

export interface ICartItem {
  productId: string;    // in db
  productName: string;
  description?: string;
  merchantId?: string;
  merchantName?: string;
  price: number;        // in db
  cost: number;         // in db
  quantity: number;     // in db
}

export interface ICart {
  clientId?: string;
  clientName?: string;
  merchantId?: string;
  merchantName?: string;
  items: ICartItem[];
}

export interface ICharge {
  price: number;
  cost: number;
  total: number;
  tax: number;
  deliveryCost?: number;
  deliveryDiscount?: number;
  overRangeCharge?: number;
  groupDiscount?: number;
  tips?: number;
}
