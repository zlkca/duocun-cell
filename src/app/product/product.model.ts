import { Picture } from '../picture.model';

export interface IProduct {
  _id?: string;
  id?: string;
  name: string;
  nameEN: string;
  description?: string;
  price: number;
  cost: number;
  merchantId: string;
  merchant?: any;
  categoryId: string;
  created?: Date;
  modified?: Date;
  category?: Category;
  pictures?: Picture[];
}

export class Product implements IProduct {
  name: string;
  nameEN: string;
  description: string;
  price: number;
  cost: number;
  categoryId: string;
  merchantId: string;
  created: Date;
  modified: Date;
  id: string;
  category: Category;
  pictures: Picture[];
  constructor(data?: IProduct) {
    Object.assign(this, data);
  }
}

export interface ICategory {
  name: string;
  description?: string;
  created?: Date;
  modified?: Date;
  id?: string;
  products?: Product[];
}

export class Category implements ICategory {
  name: string;
  description: string;
  created: Date;
  modified: Date;
  id: string;
  products: Product[];
  constructor(data?: ICategory) {
    Object.assign(this, data);
  }
}
