import React from "react";
import Sidebar from "../components/SideBar";
import AddProduct from "./Product";


const Dashboard = () => {
  const dashboardStyles = {
    display: "flex",
    minHeight: "100vh",
  };

  const mainContentStyles = {
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    paddingLeft: "30px",
    paddingTop: "30px",
  };

  const summaryCardsStyles = {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
  };

  const cardStyles = {
    backgroundColor: "#f0f0f0",
    padding: "20px",
    flex: 1,
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={dashboardStyles}>
      <Sidebar />
      <div style={mainContentStyles}>
        <h1>Dashboard</h1>
        <p>Welcome to the admin panel!</p>
        <div style={summaryCardsStyles}>
          <div style={cardStyles}>
            <h3>Total Users</h3>
            <p>100</p>
          </div>
          <div style={cardStyles}>
            <h3>Total Products</h3>
            <p>50</p>
          </div>
        </div>
        <h2>Add New Product</h2>
        <AddProduct />
      </div>
    </div>
  );
};

export default Dashboard;
