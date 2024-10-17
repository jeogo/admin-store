"use client";

import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../services/api";
import { Product, Category } from "../services/types";

interface ProductFormData {
  name: string;
  cost: number;
  emails: string[];
  password: string;
  categoryId: string;
}

const initialProductFormData: ProductFormData = {
  name: "",
  cost: 0,
  emails: [],
  password: "",
  categoryId: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<ProductFormData>(
    initialProductFormData
  );
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductFormData>(
    initialProductFormData
  );
  const [expandedEmails, setExpandedEmails] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    setFunction: React.Dispatch<React.SetStateAction<ProductFormData>>
  ) => {
    const { name, value } = e.target;
    setFunction((prev) => ({
      ...prev,
      [name]: name === "cost" ? Number(value) : value,
    }));
  };

  const handleEmailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setFunction: React.Dispatch<React.SetStateAction<ProductFormData>>
  ) => {
    const emails = e.target.value
      .split("\n")
      .map((email) => email.trim())
      .filter(Boolean);
    setFunction((prev) => ({ ...prev, emails }));
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      newProduct.cost <= 0 ||
      !newProduct.categoryId ||
      !newProduct.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    try {
      const createdProduct = await createProduct(newProduct);
      setProducts((prev) => [...prev, createdProduct]);
      setNewProduct(initialProductFormData);
    } catch (error) {
      setError("Failed to create product. Please try again.");
      console.error("Error creating product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product._id);
    setEditingProduct({
      name: product.name || "",
      cost: product.cost || 0,
      emails: product.emails?.filter(Boolean) || [],
      password: product.password || "",
      categoryId:
        typeof product.categoryId === "object"
          ? product.categoryId._id
          : product.categoryId,
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !editingProduct.name ||
      editingProduct.cost <= 0 ||
      !editingProduct.categoryId ||
      !editingProduct.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    try {
      await updateProduct(editingProductId!, editingProduct);
      setEditingProductId(null);
      setEditingProduct(initialProductFormData);
      await fetchData(); // Re-fetch products after update
    } catch (error) {
      setError("Failed to update product. Please try again.");
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteProduct(id);
      await fetchData(); // Re-fetch products after deletion
    } catch (error) {
      setError("Failed to delete product. Please try again.");
      console.error("Error deleting product:", error);
    }
  };

  const toggleEmails = (productId: string) => {
    setExpandedEmails((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const renderProductForm = (
    product: ProductFormData,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    setFunction: React.Dispatch<React.SetStateAction<ProductFormData>>,
    submitText: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={(e) => handleInputChange(e, setFunction)}
        placeholder="Product Name"
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      />
      <input
        type="number"
        name="cost"
        value={product.cost}
        onChange={(e) => handleInputChange(e, setFunction)}
        placeholder="Cost"
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
        min="1"
      />
      <textarea
        name="emails"
        value={product.emails.join("\n")}
        onChange={(e) => handleEmailsChange(e, setFunction)}
        placeholder="Emails (one per line)"
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        name="password"
        value={product.password}
        onChange={(e) => handleInputChange(e, setFunction)}
        placeholder="Password"
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      />
      <select
        name="categoryId"
        value={product.categoryId}
        onChange={(e) => handleInputChange(e, setFunction)}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        {submitText}
      </button>
    </form>
  );

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-center">
        Products Management
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
        {renderProductForm(
          newProduct,
          handleCreate,
          setNewProduct,
          "Create Product"
        )}
      </div>
      {loading && products.length > 0 ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products
            .filter((product) => product._id)
            .map((product) => (
              <div key={product?._id} className="flex flex-col">
                <div className="border p-4 rounded-lg shadow hover:bg-gray-50">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p>Cost: {product.cost} points</p>
                  <p>
                    Emails:{" "}
                    {product.emails?.length > 3
                      ? product.emails.slice(0, 3).join(", ") + ", ..."
                      : product.emails?.join(", ") || "No emails"}
                  </p>
                  {product.emails?.length > 3 && (
                    <button
                      onClick={() => toggleEmails(product._id)}
                      className="text-blue-500 underline"
                    >
                      {expandedEmails[product._id] ? "Show less" : "Show more"}
                    </button>
                  )}
                  {expandedEmails[product._id] && (
                    <ul className="mt-2">
                      {product.emails?.map((email, index) => (
                        <li key={`${product._id}-email-${index}`}>{email}</li>
                      ))}
                    </ul>
                  )}
                  <p>Password: {product.password}</p>
                  <p>
                    Category:{" "}
                    {typeof product.categoryId === "object"
                      ? product.categoryId.name
                      : categories.find((cat) => cat._id === product.categoryId)
                          ?.name || "Uncategorized"}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {expandedEmails[product._id] && (
                  <ul className="mt-2">
                    {product.emails?.map((email, index) => (
                      <li key={`${product._id}-email-${index}`}>{email}</li>
                    ))}
                  </ul>
                )}

                {editingProductId === product._id && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Edit Product</h4>
                    {renderProductForm(
                      editingProduct,
                      handleUpdate,
                      setEditingProduct,
                      "Update Product"
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </Layout>
  );
}
