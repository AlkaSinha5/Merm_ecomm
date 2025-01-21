import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

// Styled Components
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
  padding: 10px;
  background-color: #f8f9fa;
  overflow-y: auto; /* Allow scrolling in main content */
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-top: 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #333333;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fdfdfd;
  border-radius: 10px;
  padding: 20px 40px 20px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3f46;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &:hover {
    border-color: #4a3f46;
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3f46;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &:hover {
    border-color: #4a3f46;
  }
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

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &.edit {
    background-color: #f0ad4e;
    margin-right: 10px;
    &:hover {
      background-color: #ec971f;
    }
  }

  &.delete {
    background-color: #d9534f;
    &:hover {
      background-color: #c9302c;
    }
  }
`;

const ErrorText = styled.p`
  color: #d9534f;
  margin-top: 10px;
`;

const CouponList = styled.div`
  margin-top: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 12px 30px 12px 20px;
  background-color: #4a3f46;
  color: white;
  text-align: left;
`;

const TableData = styled.td`
  padding: 12px 30px 12px 20px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const AddCoupon = () => {
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercent: "",
    expiryDate: "",
    isActive: false,
    id: null,
  });
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/coupon");
        setCoupons(response.data.coupon);
      } catch (err) {
        setError("Failed to fetch coupons. Please try again.");
      }
    };

    fetchCoupons();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCoupon((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value, // Convert `isActive` to boolean
    }));
  };

  const handleAddOrUpdateCoupon = async () => {
    const { code, discountPercent, expiryDate, isActive, id } = coupon;

    if (!code || !discountPercent || !expiryDate) {
      setError("All fields are required!");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (id) {
        // Update an existing coupon
        await axios.put(`http://localhost:8080/api/coupon/update/${id}`, {
          code,
          discountPercent,
          expiryDate,
          isActive,
        });
        setCoupons((prevCoupons) =>
          prevCoupons.map((c) =>
            c._id === id ? { ...c, code, discountPercent, expiryDate, isActive } : c
          )
        );
      } else {
        // Add a new coupon
        const response = await axios.post("http://localhost:8080/api/coupon/add", {
          code,
          discountPercent,
          expiryDate,
          isActive,
        });
        setCoupons((prevCoupons) => [...prevCoupons, response.data.coupon]);
      }

      setCoupon({ code: "", discountPercent: "", expiryDate: "", isActive: false, id: null });
    } catch (err) {
      setError("Failed to add or update coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/coupon/delete/${id}`);
      setCoupons((prevCoupons) => prevCoupons.filter((c) => c._id !== id));
    } catch (err) {
      setError("Failed to delete coupon. Please try again.");
    }
  };

  const handleEditCoupon = (id) => {
    const couponToEdit = coupons.find((c) => c._id === id);
    setCoupon({
      code: couponToEdit.code,
      discountPercent: couponToEdit.discountPercent,
      expiryDate: couponToEdit.expiryDate || "",
      isActive: couponToEdit.isActive || false,
      id: couponToEdit._id,
    });
  };

  return (
    <Container>
       <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContent>
        <Card>
          <Title>{coupon.id ? "Edit Coupon" : "Add Coupon"}</Title>
          <FlexContainer>
            {/* Coupon Code Input */}
            <FormGroup>
              <label htmlFor="code">Coupon Code</label>
              <Input
                type="text"
                id="code"
                name="code"
                value={coupon.code}
                onChange={handleInputChange}
                placeholder="Enter Coupon Code"
              />
            </FormGroup>

            {/* Discount Percentage Input */}
            <FormGroup>
              <label htmlFor="discountPercent">Discount Percent (%)</label>
              <Input
                type="number"
                id="discountPercent"
                name="discountPercent"
                value={coupon.discountPercent}
                onChange={handleInputChange}
                placeholder="Enter Discount Percentage"
              />
            </FormGroup>

            {/* Expiry Date Input */}
            <FormGroup>
              <label htmlFor="expiryDate">Expiry Date</label>
              <Input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={coupon.expiryDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]} 
              />
            </FormGroup>

            {/* Is Active Input */}
            <FormGroup>
              <label htmlFor="isActive">Is Active</label>
              <Select
  id="isActive"
  name="isActive"
  value={coupon.isActive ? "true" : "false"} // Convert boolean to string for the select value
  onChange={handleInputChange}
>
  <option value="true">Active</option>
  <option value="false">Inactive</option>
</Select>
            </FormGroup>
          </FlexContainer>

          {error && <ErrorText>{error}</ErrorText>}

          <Button onClick={handleAddOrUpdateCoupon} disabled={loading}>
            {loading ? "Processing..." : coupon.id ? "Update Coupon" : "Add Coupon"}
          </Button>
        </Card>

        <CouponList>
          <Title>Coupon List</Title>
          <Table>
            <thead>
              <tr>
              <TableHeader>Sl. No.</TableHeader>
                <TableHeader>Code</TableHeader>
                <TableHeader>Discount (%)</TableHeader>
                <TableHeader>Expiry Date</TableHeader>
                <TableHeader>Is Active</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
  {coupons.map((c, index) => {
    if (!c) return null; // Skip if the coupon object is undefined or null
    return (
      <TableRow key={c._id }>
        <TableData>{index+1}</TableData>
        <TableData>{c.code || "N/A"}</TableData>
        <TableData>{c.discountPercent || "N/A"}</TableData>
        <TableData>{c.expiryDate || "N/A"}</TableData>
        <TableData>{c.isActive ? "Yes" : "No"}</TableData>
        <TableData>
          <Button className="edit" onClick={() => handleEditCoupon(c._id)}>
            Edit
          </Button>
          <Button className="delete" onClick={() => handleDeleteCoupon(c._id)}>
            Delete
          </Button>
        </TableData>
      </TableRow>
    );
  })}
</tbody>

          </Table>
        </CouponList>
      </MainContent>
    </Container>
  );
};

export default AddCoupon;
