import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

// Styled components (same as before, no changes here)
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px; /* Set sidebar width */
  height: 100%;
  background-color: #4a3f46; /* Adjust the sidebar color */
  padding-top: 20px;
`;
const MainContent = styled.div`
margin-left: 250px; /* Space for the fixed sidebar */
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
   overflow-y: auto; /* Allow scrolling in main content */
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 15px;

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
  margin-bottom: 15px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  background-color: #fff;
  margin-bottom: 15px;

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

const Button = styled.button`
  background-color: #4a3f46;
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
    sizes: "",
    category: "",
    subcategory: "",
    quantity: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category");
        setCategories(response.data.categories);
      } catch {
        setError("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (product.category) {
        console.log(product.category)
        try {
          const response = await axios.get(`http://localhost:8080/api/subcategory/${product.category}`);
          console.log(response)
          setSubcategories(response.data.data);
        } catch {
          setError("Failed to load subcategories.");
        }
      }
    };
    fetchSubcategories();
  }, [product.category]);

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;

    if (name === "price") {
      setProduct((prev) => ({
        ...prev,
        price: { ...prev.price, [dataset.field]: value },
      }));
    } else if (name === "sizes") {
      setProduct((prev) => ({
        ...prev,
        sizes: value,
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
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          img: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleAddProduct = async () => {
    const { title, name, desc, img, price, quantity, sizes, category, subcategory } = product;

    // Validate required fields
    if (!title || !name || !desc || !img || !price || !quantity || !sizes || !category || !subcategory) {
      setError("All fields are required!");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/products/add", {
        title,
        name,
        desc,
        img,
        price,
        quantity,
        sizes: sizes.split(",").map((s) => s.trim()),
        category,
        subcategory,
      });
      console.log("Product added successfully:", response.data);
      setProduct({
        title: "",
        name: "",
        desc: "",
        img: "",
        price: { org: "", mrp: "", off: "" },
        sizes: "",
        category: "",
        subcategory: "",
        quantity: "",
      });
    } catch {
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContent>
        <h2>Add New Product</h2>
        <FormWrapper>
          <div>
            <Input type="text" name="title" value={product.title} onChange={handleInputChange} placeholder="Product Title" />
            <Input type="text" name="name" value={product.name} onChange={handleInputChange} placeholder="Product Name" />
            <Input type="file" name="img" onChange={handleFileChange} placeholder="Product Image" />
            {product.img && (
              <ImagePreview>
                <img src={product.img} alt="Preview" />
              </ImagePreview>
            )}
           
            <Input type="number" name="price" data-field="org" value={product.price.org} onChange={handleInputChange} placeholder="Original Price" />
            <Input type="number" name="price" data-field="mrp" value={product.price.mrp} onChange={handleInputChange} placeholder="MRP" />
            <Input type="number" name="price" data-field="off" value={product.price.off} onChange={handleInputChange} placeholder="Discount" />
          </div>
          <div>
          <Input type="number" name="quantity" value={product.quantity} onChange={handleInputChange} placeholder="Quantity" />
            <Textarea name="desc" value={product.desc} onChange={handleInputChange} placeholder="Product Description" />
            <Textarea name="sizes" value={product.sizes} onChange={handleInputChange} placeholder="Sizes (comma-separated)" />
            <Select name="category" value={product.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <Select name="subcategory" value={product.subcategory} onChange={handleInputChange}>
              <option value="">Select Subcategory</option>
              {subcategories.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </option>
              ))}
            </Select>
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
