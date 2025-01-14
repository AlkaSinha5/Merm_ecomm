import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

// Styled Components for Sidebar
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
  display: block;
  
  /* Apply highlight for active link */
  &.active {
    background: #333; /* Highlight active link */
    font-weight: bold;  /* Add bold text for active state */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add a soft shadow effect */
  }

  &:hover {
    background: #555;
  }
`;

const SidebarItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainLink = styled.div`
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #555;
  }
`;

const SubLinks = styled.div`
  margin-left: 15px;
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
`;

const SubLink = styled(SidebarLink)`
  padding-left: 25px;
`;

const Sidebar = () => {
  const location = useLocation(); // Get current location
  const [isProductsOpen, setIsProductsOpen] = useState(false);

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

      {/* Products Section */}
      <SidebarItem>
        <MainLink onClick={() => setIsProductsOpen(!isProductsOpen)}>
          Products
          <span>{isProductsOpen ? "▲" : "▼"}</span>
        </MainLink>
        <SubLinks isVisible={isProductsOpen}>
          <SubLink
            to="/admin/category"
            className={location.pathname === "/admin/category" ? "active" : ""}
          >
            Add Category
          </SubLink>
          <SubLink
            to="/admin/products"
            className={location.pathname === "/admin/products" ? "active" : ""}
          >
            Add Product
          </SubLink>
        </SubLinks>
      </SidebarItem>

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
