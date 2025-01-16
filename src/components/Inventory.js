import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  // Add new product
  const addProduct = async (e) => {
    e.preventDefault();
    const { name, description, stock, price } = newProduct;
    const { error } = await supabase
      .from("products")
      .insert([{ name, description, stock, price }]);
    if (error) {
      console.error("Error adding product:", error);
    } else {
      fetchProducts();
      setNewProduct({ name: "", description: "", stock: 0, price: 0 });
      alert("Product added successfully!");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      fetchProducts();
      alert("Product deleted successfully!");
    }
  };

  // Load products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      {/* Product Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {product.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.description || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.stock}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add Product Form */}
      <h2 className="text-xl font-bold mt-6">Add Product</h2>
      <form onSubmit={addProduct} className="mt-4 space-y-4">
        <input
          type="text"
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <input
          type="number"
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
          }
          required
        />
        <input
          type="number"
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Inventory;
