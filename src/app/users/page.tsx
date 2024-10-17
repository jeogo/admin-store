"use client";

import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUser } from "../services/api";
import Layout from "../components/Layout";
import { User } from "../services/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [updatedBalance, setUpdatedBalance] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        setError("Failed to fetch users.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
    } catch (error) {
      setError("Failed to delete user.");
      console.error("Error deleting user:", error);
    }
  };

  // Handle edit (update) user
  const handleEdit = (user: User) => {
    setEditingUserId(user._id);
    setUpdatedBalance(user.balance);
  };

  // Handle save updated balance
  const handleSave = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await updateUser(id, { balance: updatedBalance });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, balance: updatedBalance } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, balance: updatedBalance } : user
        )
      );
      setEditingUserId(null);
    } catch (error) {
      setError("Failed to update user.");
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle balance input change
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedBalance(Number(e.target.value));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.username.toLowerCase().includes(query))
    );
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-center">Users Management</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Search bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by username"
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {user.username}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {editingUserId === user._id ? (
                      <input
                        type="number"
                        value={updatedBalance}
                        onChange={handleBalanceChange}
                        className="px-3 py-2 border rounded-md w-28"
                      />
                    ) : (
                      <span>{user.balance} points</span>
                    )}
                  </p>
                </div>
                <div className="flex justify-between space-x-2">
                  {editingUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleSave(user._id)}
                        disabled={saving}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-green-300"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-4">No users found.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
