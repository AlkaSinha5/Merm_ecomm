// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Styled Component for Sidebar
const SidebarContainer = styled.div`
  width: 250px;
  background-color: #4a3f46;
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

const Sidebar = () => {
  return (
    <SidebarContainer>
      <h2>Admin Panel</h2>
      <SidebarLink to="/admin/dashboard">Dashboard</SidebarLink>
      <SidebarLink to="/admin/users">Manage Users</SidebarLink>
      <SidebarLink to="/admin/products">Add Products</SidebarLink>
      <SidebarLink to="/admin/products/list">Manage Product</SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
