"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import Layout from "../components/Layout";
import { Category } from "../services/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState<string>("");

  // Function to fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      setError("Failed to fetch categories.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle category creation
  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setError(null);
    try {
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
      });
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategoryName("");
    } catch (error) {
      setError("Failed to create category.");
      console.error("Error creating category:", error);
    }
  };

  // Handle category deletion
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteCategory(id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== id)
      );
    } catch (error) {
      setError("Failed to delete category.");
      console.error("Error deleting category:", error);
    }
  };

  // Handle edit initiation
  const handleEdit = (category: Category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
  };

  // Handle category update
  const handleUpdate = async () => {
    if (!editingCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setError(null);
    try {
      const updatedCategory = await updateCategory(editingCategoryId!, {
        name: editingCategoryName.trim(),
      });

      // Update the state with the updated category and immediately refresh the UI
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === editingCategoryId ? updatedCategory : category
        )
      );

      // Reset editing mode and form
      setEditingCategoryId(null);
      setEditingCategoryName("");

      // Optionally re-fetch categories to ensure latest data
      await fetchCategories(); // Now this works as expected
    } catch (error) {
      setError("Failed to update category.");
      console.error("Error updating category:", error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setError(null);
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-center">
        Categories Management
      </h1>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Create Category */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter new category name"
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-6 py-3 rounded-r-lg hover:bg-green-600 transition"
        >
          Create
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <div className="overflow-x-auto">
          {categories.length > 0 ? (
            <div className="space-y-4">
              {categories
                .filter((category) => category._id) // Filter out categories with undefined _id
                .map((category, index) => (
                  <div
                    key={category._id || index} // Fallback to array index if _id is missing
                    className="border p-4 rounded-lg shadow hover:bg-gray-100 transition flex justify-between items-center"
                  >
                    <div className="flex-grow">
                      {editingCategoryId === category._id ? (
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) =>
                            setEditingCategoryName(e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      ) : (
                        <span className="text-lg font-medium">
                          {category.name}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      {editingCategoryId === category._id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center mt-4">No categories found.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
