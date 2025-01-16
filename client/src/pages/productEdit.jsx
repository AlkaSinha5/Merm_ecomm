import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/SideBar";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f4f4;
`;

const EditProductContainer = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-left: 20px;
  margin-right: 20px;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
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

const EditProductPage = () => {
  const [product, setProduct] = useState({
    title: "",
    desc: "",
    price: {
      org: "",
      mrp: "",
      off: "",
    },
    img: "",
    quantity:""
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // To get the product ID from the URL
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // Fetch the product data from the backend
    axios
      .get(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["org", "mrp", "off"].includes(name)) {
      setProduct((prev) => ({
        ...prev,
        price: {
          ...prev.price,
          [name]: value,
        },
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

    // Convert the image to base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({
        ...prev,
        img: reader.result, // This will be the base64 encoded image string
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // This will trigger the `onloadend` event
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8080/api/products/update/${id}`,
        product,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      navigate("/admin/products/list"); // Redirect to the product list after successful update
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Sidebar />
      <EditProductContainer>
        <Heading>Edit Product</Heading>
        <Form onSubmit={handleSubmit}>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
          />

          <Label>Description</Label>
          <Input
            type="text"
            name="desc"
            value={product.desc}
            onChange={handleChange}
          />

          <Label>Image URL</Label>
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
           <Label>Quantity</Label>
          <Input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
          />
          <Label>Original Price</Label>
          <Input
            type="number"
            name="org"
            value={product.price.org}
            onChange={handleChange}
          />

          <Label>MRP Price</Label>
          <Input
            type="number"
            name="mrp"
            value={product.price.mrp}
            onChange={handleChange}
          />

          <Label>Discount (%)</Label>
          <Input
            type="number"
            name="off"
            value={product.price.off}
            onChange={handleChange}
          />

          <Button type="submit">Update Product</Button>
        </Form>
      </EditProductContainer>
    </Container>
  );
};

export default EditProductPage;
