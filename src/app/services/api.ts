// apiClient.ts

import axios from "axios";
import { User, Product, Category } from "./types";

const API_URL = "https://store-bot.zeabur.app/api"; // Base API URL

// ----------------- USERS CRUD -----------------

// Fetch list of users (GET)
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create user (POST)
export const createUser = async (data: Omit<User, "_id">): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_URL}/users`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Get user by ID (GET)
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Update user (PUT)
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  try {
    const response = await axios.put<User>(`${API_URL}/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user (DELETE)
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete<void>(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ----------------- PRODUCTS CRUD -----------------

// Fetch list of products (GET)
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Create product (POST)
export const createProduct = async (
  data: Omit<Product, "_id">
): Promise<Product> => {
  try {
    const response = await axios.post<Product>(`${API_URL}/products`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Get product by ID (GET)
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Update product (PUT)
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  try {
    const response = await axios.put<Product>(
      `${API_URL}/products/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product (DELETE)
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await axios.delete<void>(`${API_URL}/products/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ----------------- CATEGORIES CRUD -----------------

// Fetch list of categories (GET)
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Create category (POST)
export const createCategory = async (
  data: Omit<Category, "_id">
): Promise<Category> => {
  try {
    const response = await axios.post<Category>(`${API_URL}/categories`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Get category by ID (GET)
export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await axios.get<Category>(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// Update category (PUT)
export const updateCategory = async (
  id: string,
  data: Partial<Category>
): Promise<Category> => {
  try {
    const response = await axios.put<Category>(
      `${API_URL}/categories/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete category (DELETE)
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await axios.delete<void>(`${API_URL}/categories/${id}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// ----------------- ADDITIONAL CATEGORY OPERATIONS -----------------

// Get products by category ID (GET)
export const getProductsByCategory = async (
  categoryId: string
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${API_URL}/categories/${categoryId}/products`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

// Add product to category (POST)
export const addProductToCategory = async (
  categoryId: string,
  data: Omit<Product, "_id" | "categoryId">
): Promise<Product> => {
  try {
    const response = await axios.post<Product>(
      `${API_URL}/categories/${categoryId}/products`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product to category:", error);
    throw error;
  }
};
