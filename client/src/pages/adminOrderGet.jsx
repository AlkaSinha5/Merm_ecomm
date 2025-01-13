import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

// Main container with sidebar and admin content
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f4f4;
`;

// Sidebar container styling
const SidebarContainer = styled.div`
  width: 20%;
  background-color: #333;
  color: #fff;
  min-height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

// Admin orders content container
const ContainerAdmin = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Heading styling
const Heading = styled.h1`
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
  color: #444;
  text-align: center;
`;

// Table container for scrollable content
const TableWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  overflow-x: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

// Table styling
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px; /* Ensures proper structure on smaller screens */
`;

const TableHead = styled.thead`
  background-color: #007bff;
  color: #fff;

  th {
    padding: 15px;
    text-align: left;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:nth-child(even) {
      background-color: #f9f9f9;
    }

    &:hover {
      background-color: #f1f1f1;
    }
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    word-wrap: break-word;
  }
`;

// Product list inside each order
const ProductsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 5px;
  }
`;

// Loading or no orders message
const Message = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/orderAdmin", {
          headers: { Authorization: `Bearer ${localStorage.getItem("krist-app-token")}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      {/* Sidebar */}
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>

      {/* Admin Orders Content */}
      <ContainerAdmin>
        <Heading>Admin - Orders</Heading>
        {orders.length === 0 ? (
          <Message>No orders found.</Message>
        ) : (
          <TableWrapper>
            <Table>
              <TableHead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Amount</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Order Shipping</th>
                  <th>Order Process</th>
                  <th>Order Delivered</th>
                  <th>Order Cancelled</th>
                  <th>Products</th>
                </tr>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.total_amount.$numberDecimal}</td>
                    <td>{order.address}</td>
                    <td>{order.status}</td>
                    <td>{order.orderShipping ? "Yes" : "No"}</td>
                    <td>{order.orderProcess ? "Yes" : "No"}</td>
                    <td>{order.orderDeliverd ? "Yes" : "No"}</td>
                    <td>{order.orderCancel ? "Yes" : "No"}</td>
                    <td>
                      <ProductsList>
                        {order.products.map((productItem) => (
                          <li key={productItem.product._id}>
                            Product ID: {productItem.product._id}, Quantity: {productItem.quantity}
                          </li>
                        ))}
                      </ProductsList>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </ContainerAdmin>
    </Container>
  );
};

export default AdminOrdersPage;
