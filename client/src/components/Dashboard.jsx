import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Sidebar from "./SideBar";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #4a3f46;
  color: white;
  // padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px; /* Adjusted to make space for fixed sidebar */
  padding: 20px;
  background-color: #f4f4f4;
  overflow-y: auto; /* Make main content scrollable */
  height: 100vh;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 3 columns */
  gap: 20px;
  width: 100%;
`;

const StatCard = styled(Link)`
  background: ${(props) => props.color || "white"};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalEnquiries: 0,
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:8080/api/user/get");
        const productsResponse = await axios.get("http://localhost:8080/api/products/");
        const enquiriesResponse = await axios.get("http://localhost:8080/api/enquiry/");

        setData({
          totalProducts: productsResponse.data?.length || 0,
          totalUsers: usersResponse.data.users?.length || 0,
          totalEnquiries: enquiriesResponse.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Calculating total, pending, and delivered orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => !order.orderDeliverd).length;
  const deliveredOrders = orders.filter((order) => order.orderDeliverd).length;

  return (
    <Container>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContent>
        <h1>Dashboard</h1>
        <StatsContainer>
          <StatCard to="/admin/users" color="#CE93D8">
            <h3>Total Users</h3>
            <p>{data.totalUsers}</p>
          </StatCard>
          <StatCard to="/admin/products/list" color="#afedaf">
            <h3>Total Products</h3>
            <p>{data.totalProducts}</p>
          </StatCard>
          <StatCard to="/admin/order" color="#ffa07a">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </StatCard>
          <StatCard to="/admin/order" color="#ffcccb">
            <h3>Pending Orders</h3>
            <p>{pendingOrders}</p>
          </StatCard>
          <StatCard to="/admin/order" color="#FFF176">
            <h3>Delivered Orders</h3>
            <p>{deliveredOrders}</p>
          </StatCard>
          <StatCard to="/admin/enquiry" color="#d1c4e9">
            <h3>Total Enquiries</h3>
            <p>{data.totalEnquiries}</p>
          </StatCard>
        </StatsContainer>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
