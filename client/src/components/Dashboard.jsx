// Dashboard.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Sidebar from "./SideBar";


const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const StatCard = styled.div`
  background: ${(props) => props.color || "white"};
  padding: 20px;
  border-radius: 10px;
  flex: 1;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/get");
        const res = await axios.get("http://localhost:8080/api/products/");
        setData({
          totalProducts: res.data.length,
          totalUsers: response.data.count,
          totalSales: response.data.totalSales,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <MainContent>
        <h1>Dashboard</h1>
        <StatsContainer>
          <StatCard color="#afedaf">
            <h3>Total Products</h3>
            <p>{data.totalProducts}</p>
          </StatCard>
          <StatCard color="#afede6">
            <h3>Total Users</h3>
            <p>{data.totalUsers}</p>
          </StatCard>
          {/* <StatCard color="#e2afed">
            <h3>Total Sales</h3>
            <p>${data.totalSales}</p>
          </StatCard> */}
        </StatsContainer>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
