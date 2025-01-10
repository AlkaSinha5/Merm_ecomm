// src/components/AddProduct.js
import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    name: "",
    desc: "",
    img: "",
    price: { org: "", mrp: "", off: "" },
    sizes: [],
    category: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      setProduct((prev) => ({
        ...prev,
        price: { ...prev.price, [e.target.dataset.field]: value },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = async () => {
    const { title, name, desc, img, price } = product;
    if (!title || !name || !desc || !img || !price.org) {
      setError("All fields are required!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/products/add", [product]);
      console.log("Product added successfully:", response.data);
      // Handle success (e.g., reset form, navigate to another page)
    } catch (error) {
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <div>
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleInputChange}
          placeholder="Product Title"
        />
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          placeholder="Product Name"
        />
        <textarea
          name="desc"
          value={product.desc}
          onChange={handleInputChange}
          placeholder="Product Description"
        />
        <input
          type="text"
          name="img"
          value={product.img}
          onChange={handleInputChange}
          placeholder="Product Image URL"
        />
        <input
          type="number"
          name="price"
          data-field="org"
          value={product.price.org}
          onChange={handleInputChange}
          placeholder="Original Price"
        />
        <input
          type="number"
          name="price"
          data-field="mrp"
          value={product.price.mrp}
          onChange={handleInputChange}
          placeholder="MRP"
        />
        <input
          type="number"
          name="price"
          data-field="off"
          value={product.price.off}
          onChange={handleInputChange}
          placeholder="Discount"
        />
        <textarea
          name="sizes"
          value={product.sizes}
          onChange={handleInputChange}
          placeholder="Sizes (comma separated)"
        />
        <textarea
          name="category"
          value={product.category}
          onChange={handleInputChange}
          placeholder="Categories (comma separated)"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleAddProduct} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
