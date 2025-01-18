import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import styled from "styled-components";
import Sidebar from "../components/SideBar"; // Sidebar import
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// Styled Components for the layout
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ProductListContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #4a3f46;
  color: white;
  text-align: left;
  font-size: 1rem;
`;

const TableData = styled.td`
  padding: 12px;
  border: 1px solid #ccc;
  text-align: left;
`;

const ProductImage = styled.img`
  width: 50px;  // Smaller image size
  height: auto;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  margin-right: 10px; /* To add space between buttons */

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px; /* Adds space between the buttons */
`;
const EditButton = styled(Button)`
  background-color: #28a745; /* Green for Edit */
  color: white;

  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545; /* Red for Delete */
  color: white;

  &:hover {
    background-color: #c82333; /* Darker red on hover */
  }
`;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation
  const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage

  useEffect(() => {
    // Fetch the list of products from the backend API
    axios
      .get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [token]);

  // Delete product handler
  
    const deleteProduct = async (Id) => {
        confirmAlert({
          title: "Confirm Deletion",
          message: "Are you sure you want to delete this roduct?",
          buttons: [
            {
              label: "Yes",
              onClick: async () => {
                try {
                  const res = await axios.delete(`http://localhost:8080/api/products/delete/${Id}`); // Replace with your delete API endpoint
                  setProducts(products.filter((product) => product._id !== Id)); // Update UI after deletion
                  toast.success(res.data.message);
                } catch (error) {
                  console.error("Error deleting product:", error);
                  toast.error("Failed to delete product.");
                }
              },
            },
            {
              label: "No",
              onClick: () => {}, // Do nothing if "No" is clicked
            },
          ],
        });
      };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar />

      {/* Product List Container */}
      <ProductListContainer>
        <h2>Product List</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>Sl. No</TableHeader>
              <TableHeader>Image</TableHeader>
              <TableHeader>Title</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Price (Original)</TableHeader>
              <TableHeader>Price (MRP)</TableHeader>
              <TableHeader>Discount (%)</TableHeader>
              <TableHeader>Quantity</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {products.map((product,index) => (
              <tr key={product._id}>
                <TableData>{index+1}</TableData>
                <TableData>
                  <ProductImage src={product.img} alt={product.title} />
                </TableData>
                <TableData>{product.title}</TableData>
                <TableData>{product.desc}</TableData>
                <TableData>${product.price.org}</TableData>
                <TableData>${product.price.mrp}</TableData>
                <TableData>{product.price.off}%</TableData>
                <TableData>{product.quantity}</TableData>
                <TableData>
                <ButtonContainer>
    <Link to={`/admin/products/edit/${product._id}`}>
      <EditButton>Edit</EditButton>
    </Link>
    <DeleteButton onClick={() => deleteProduct(product._id)}>Delete</DeleteButton>
  </ButtonContainer>
                </TableData>
              </tr>
            ))}
          </tbody>
        </Table>
      </ProductListContainer>
    </Container>
  );
};

export default ProductPage;
