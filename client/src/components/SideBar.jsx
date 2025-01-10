// components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ width: "200px", background: "#f4f4f4", height: "100vh", padding: "20px" }}>
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/products">Products</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
