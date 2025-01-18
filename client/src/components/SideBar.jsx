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

  &.active {
    background: #333;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
  margin-top: 10px;
  margin-left: 15px;
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
`;

const SubLink = styled(SidebarLink)`
  padding-left: 25px;
  margin-bottom: 10px;
`;

const Sidebar = () => {
  const location = useLocation(); // Get current location
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isInformationsOpen, setIsInformationsOpen] = useState(false);

  // Check if the submenu should be open based on the current path
  const isProductsPath = location.pathname.startsWith("/admin/category") ||
    location.pathname.startsWith("/admin/subcategory") ||
    location.pathname.startsWith("/admin/products");

  const isInformationsPath = location.pathname.startsWith("/admin/slidder") ||
    location.pathname.startsWith("/admin/enquiry") ||
    location.pathname.startsWith("/admin/address") ||
    location.pathname.startsWith("/admin/coupon");

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
        <SubLinks isVisible={isProductsOpen || isProductsPath}>
          <SubLink
            to="/admin/category"
            className={location.pathname === "/admin/category" ? "active" : ""}
          >
            Add Category
          </SubLink>
          <SubLink
            to="/admin/subcategory"
            className={location.pathname === "/admin/subcategory" ? "active" : ""}
          >
            Add Sub Category
          </SubLink>
          <SubLink
            to="/admin/products"
            className={location.pathname === "/admin/products" ? "active" : ""}
          >
            Add Product
          </SubLink>
          <SubLink
            to="/admin/products/list"
            className={location.pathname === "/admin/products/list" ? "active" : ""}
          >
            Product List
          </SubLink>
        </SubLinks>
      </SidebarItem>

      {/* Informations Section */}
      <SidebarItem>
        <MainLink onClick={() => setIsInformationsOpen(!isInformationsOpen)}>
          Informations
          <span>{isInformationsOpen ? "▲" : "▼"}</span>
        </MainLink>
        <SubLinks isVisible={isInformationsOpen || isInformationsPath}>
          <SubLink
            to="/admin/slidder"
            className={location.pathname === "/admin/slidder" ? "active" : ""}
          >
            Slider
          </SubLink>
          <SubLink
            to="/admin/enquiry"
            className={location.pathname === "/admin/enquiry" ? "active" : ""}
          >
            Enquiry
          </SubLink>
          <SubLink
            to="/admin/address"
            className={location.pathname === "/admin/address" ? "active" : ""}
          >
            Address
          </SubLink>
          <SubLink
            to="/admin/coupon"
            className={location.pathname === "/admin/coupon" ? "active" : ""}
          >
            Coupon
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
