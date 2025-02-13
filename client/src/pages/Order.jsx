import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Container for the page
const Container = styled.div`
  padding: 16px;
  background-color: #f4f7fc;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

// Page Heading
const Heading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
  text-transform: uppercase;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

// Card that holds each order information
const OrderCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

// Individual order detail
const OrderItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  font-size: 14px;
  color: #555;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
  }
`;

// Label for each order item
const Label = styled.span`
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

// Value of each order item
const Value = styled.span`
  color: #444;
  font-size: 14px;
  word-wrap: break-word;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

// Status badge for order progress (shipping, delivered, etc.)
const StatusBadge = styled.span`
  padding: 6px 12px;
  background-color: ${({ status }) =>
    status === "Yes" ? "#5cb85c" : status === "No" ? "#d9534f" : "#f0ad4e"};
  color: #fff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  align-self: flex-start;
  margin-top: 8px;

  @media (min-width: 768px) {
    font-size: 14px;
    align-self: center;
  }
`;

// List of products within the order
const ProductsList = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #666;
  padding-left: 20px;
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 13px;
  }

  @media (min-width: 768px) {
    li {
      flex-direction: row;
      font-size: 14px;
    }
  }
`;

// Message when no orders are found
const Message = styled.p`
  font-size: 18px;
  text-align: center;
  color: #888;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

// Main component for the User Orders Page
const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});
  const token = localStorage.getItem("krist-app-token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/order", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Fetch product details by productId
  const fetchProductDetails = async (productId) => {
    if (productDetails[productId]) return; // Avoid duplicate requests for the same productId
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: response.data, // Store the product details by productId
      }));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Heading>User Orders</Heading>
      {orders.length === 0 ? (
        <Message>No orders found.</Message>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderItem>
              <Label>Order ID:</Label> <Value>{order._id}</Value>
            </OrderItem>
            <OrderItem>
              <Label>Status:</Label> <Value>{order.status}</Value>
            </OrderItem>
            <OrderItem>
              <Label>Total Amount:</Label> <Value>{order.total_amount.$numberDecimal}</Value>
            </OrderItem>
            <OrderItem>
              <Label>Address:</Label> <Value>{order.address}</Value>
            </OrderItem>
            <OrderItem>
              <Label>Order Shipping:</Label>
              <StatusBadge status={order.orderShipping ? "Yes" : "No"}>{order.orderShipping ? "Yes" : "No"}</StatusBadge>
            </OrderItem>
            <OrderItem>
              <Label>Order Process:</Label>
              <StatusBadge status={order.orderProcess ? "Yes" : "No"}>{order.orderProcess ? "Yes" : "No"}</StatusBadge>
            </OrderItem>
            <OrderItem>
              <Label>Order Delivered:</Label>
              <StatusBadge status={order.orderDeliverd ? "Yes" : "No"}>{order.orderDeliverd ? "Yes" : "No"}</StatusBadge>
            </OrderItem>
            <OrderItem>
              <Label>Order Cancelled:</Label>
              <StatusBadge status={order.orderCancel ? "Yes" : "No"}>{order.orderCancel ? "Yes" : "No"}</StatusBadge>
            </OrderItem>
            <OrderItem>
              <Label>Products:</Label>
              <ProductsList>
                {order.products.map((item) => {
                  fetchProductDetails(item.product); // Fetch product details dynamically
                  return (
                    <li key={item.product}>
                      {productDetails[item.product]
                        ? `Product Name: ${productDetails[item.product].name} | Quantity: ${item.quantity}`
                        : "Loading..."}
                    </li>
                  );
                })}
              </ProductsList>
            </OrderItem>
          </OrderCard>
        ))
      )}
    </Container>
  );
};

export default UserOrdersPage;
