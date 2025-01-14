import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Sidebar from "../components/SideBar";

// Styled Components for Sidebar and Layout
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
`;

// Styled Input and Textarea with margin
const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 15px;  // Margin added for spacing between fields

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  height: 71px;
  resize: none;
  background-color: #fff;
  margin-bottom: 15px;  // Margin added for spacing between fields

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FormWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
`;

// Styled Button
const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f0f0f0;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`;

// AddProduct Component
const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    name: "",
    desc: "",
    img: "",
    price: { org: "", mrp: "", off: "" },
    sizes: [],
    category: [],
    quantity: "",
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
    } else if (name === "sizes" || name === "category") {
      setProduct((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()), // Convert to array of strings
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Ensure only image files are allowed
    if (file && file.type.startsWith("image/")) {
      // Convert the image to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          img: reader.result, // This will be the base64 encoded image string
        }));
      };

      reader.readAsDataURL(file); // This will trigger the `onloadend` event
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleAddProduct = async () => {
    const { title, name, desc, img, price, quantity, sizes, category } = product;

    if (!title || !name || !desc || !img || !price.org || !quantity) {
      setError("All fields are required!");
      return;
    }

    setError(null);
    setLoading(true);

    // Prepare the data to send, including the base64 image
    const productData = {
      title,
      name,
      desc,
      img, // The img is now a base64 string
      price,
      quantity,
      sizes: JSON.stringify(sizes),
      category: JSON.stringify(category),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/products/add",
        productData
      );
      console.log("Product added successfully:", response.data);
      // Handle success (e.g., reset form, navigate to another page)
      setProduct({
        title: "",
        name: "",
        desc: "",
        img: "",
        price: { org: "", mrp: "", off: "" },
        sizes: [],
        category: [],
        quantity: "",
      });
    } catch (error) {
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <MainContent>
        <h2>Add New Product</h2>
        <FormWrapper>
          <div>
            <Input
              type="text"
              name="title"
              value={product.title}
              onChange={handleInputChange}
              placeholder="Product Title"
            />
            <Input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Product Name"
            />
            {/* Image Upload Input */}
            <Input
              type="file"
              name="img"
              onChange={handleFileChange}
              placeholder="Product Image"
            />
            {/* Image Preview */}
            {product.img && (
              <ImagePreview>
                <img src={product.img} alt="Preview" />
              </ImagePreview>
            )}
            <Input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
            />
            <Input
              type="number"
              name="price"
              data-field="org"
              value={product.price.org}
              onChange={handleInputChange}
              placeholder="Original Price"
            />
            <Input
              type="number"
              name="price"
              data-field="mrp"
              value={product.price.mrp}
              onChange={handleInputChange}
              placeholder="MRP"
            />
            <Input
              type="number"
              name="price"
              data-field="off"
              value={product.price.off}
              onChange={handleInputChange}
              placeholder="Discount"
            />
          </div>
          <div>
            <Textarea
              name="desc"
              value={product.desc}
              onChange={handleInputChange}
              placeholder="Product Description"
            />
            <Textarea
              name="sizes"
              value={product.sizes.join(", ")}
              onChange={handleInputChange}
              placeholder="Sizes (comma separated)"
            />
            <Textarea
              name="category"
              value={product.category.join(", ")}
              onChange={handleInputChange}
              placeholder="Categories (comma separated)"
            />
          </div>
        </FormWrapper>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button onClick={handleAddProduct} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </MainContent>
    </Container>
  );
};

export default AddProduct;
