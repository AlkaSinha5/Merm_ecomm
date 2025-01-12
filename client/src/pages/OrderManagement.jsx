import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Styled Components for Sidebar and Layout
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #333;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #555;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
`;

// OrderManagement Component
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders"); // Replace with your API endpoint
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleMarkCompleted = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/complete`); // Update order status to completed
      fetchOrders(); // Re-fetch orders after status update
    } catch (error) {
      console.error("Error marking order as completed:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`); // Delete order
      fetchOrders(); // Re-fetch orders after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <h2>Admin Panel</h2>
        <SidebarLink to="/admin/dashboard">Dashboard</SidebarLink>
        <SidebarLink to="/admin/users">Manage Users</SidebarLink>
        <SidebarLink to="/admin/products">Add Products</SidebarLink>
        <SidebarLink to="/admin/products/list">Manage Product</SidebarLink>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <h1>Order Management</h1>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.productName}</td>
                <td>{order.status}</td>
                <td>
                  {order.status !== "Completed" && (
                    <button onClick={() => handleMarkCompleted(order.id)}>
                      Mark as Completed
                    </button>
                  )}
                  <button onClick={() => handleDeleteOrder(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MainContent>
    </Container>
  );
};

export default OrderManagement;
