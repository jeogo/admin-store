// services/types.ts

export interface User {
  _id: string;
  username: string;
  balance: number;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  cost: number;
  emails: string[];
  password: string;
  categoryId: string | Category;
}
