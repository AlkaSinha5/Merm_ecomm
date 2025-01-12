import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const OrderCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("krist-app-token"); // Assuming token is stored in localStorage

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

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Heading>User Orders</Heading>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderItem>
              <Label>Order ID:</Label> <span>{order._id}</span>
            </OrderItem>
            <OrderItem>
              <Label>Status:</Label> <span>{order.status}</span>
            </OrderItem>
            <OrderItem>
              <Label>Total Amount:</Label> <span>{order.total_amount.$numberDecimal}</span>
            </OrderItem>
            <OrderItem>
              <Label>Address:</Label> <span>{order.address}</span>
            </OrderItem>
            <OrderItem>
              <Label>Order Shipping:</Label> <span>{order.orderShipping ? "Yes" : "No"}</span>
            </OrderItem>
            <OrderItem>
              <Label>Products:</Label>
              <div>
                {order.products.map((productItem) => (
                  <div key={productItem.product._id}>
                    <span>
                      {productItem.product.name} - Quantity: {productItem.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </OrderItem>
          </OrderCard>
        ))
      )}
    </Container>
  );
};

export default UserOrdersPage;
