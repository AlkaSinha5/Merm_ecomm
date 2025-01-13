import React from "react";
import { Link, useLocation } from "react-router-dom";
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

  &.active {
    background: #333; /* Highlight active link */
  }
`;

const Sidebar = () => {
  const location = useLocation(); // Get current location

  return (
    <SidebarContainer>
      <h2>Admin Panel</h2>
      <SidebarLink
        to="/admin/dashboard"
        className={location.pathname === "/admin/dashboard" ? "active" : ""}
      >
        Dashboard
      </SidebarLink>
      <SidebarLink
        to="/admin/users"
        className={location.pathname === "/admin/users" ? "active" : ""}
      >
        Manage Users
      </SidebarLink>
      <SidebarLink
        to="/admin/products"
        className={location.pathname === "/admin/products" ? "active" : ""}
      >
        Add Products
      </SidebarLink>
      <SidebarLink
        to="/admin/products/list"
        className={location.pathname === "/admin/products/list" ? "active" : ""}
      >
        Manage Product
      </SidebarLink>
      <SidebarLink
        to="/admin/order"
        className={location.pathname === "/admin/order" ? "active" : ""}
      >
        Manage Order
      </SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
