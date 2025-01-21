import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaRegListAlt, FaSlidersH, FaEnvelope, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";

// Styled Components for Sidebar
const SidebarContainer = styled.div`
  width: 200px;
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
  padding: 5px;
  border-radius: 5px;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  &.active {
    background: #333;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  &:hover {
    background: #555;
  }

  svg {
    margin-right: 10px;
  }
`;

const SidebarItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainLink = styled.div`
  color: white;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: flex-start;  // Aligns the text and icon to the left  

  &:hover {
    background: #555;
  }

  svg {
    margin-right: 10px;
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
        <FaTachometerAlt />
        Dashboard
      </SidebarLink>
      <SidebarLink
        to="/admin/users"
        className={location.pathname === "/admin/users" ? "active" : ""}
      >
        <FaUsers />
        Manage Users
      </SidebarLink>

      {/* Products Section */}
      <SidebarItem>
        <MainLink onClick={() => setIsProductsOpen(!isProductsOpen)}>
          <FaBoxOpen />
          <span style={{ marginLeft: "3px" ,marginRight: "60px"}}>Products</span>
          <span >{isProductsOpen ? "▲" : "▼"}</span>
        </MainLink>
        <SubLinks isVisible={isProductsOpen || isProductsPath}>
          <SubLink
            to="/admin/category"
            className={location.pathname === "/admin/category" ? "active" : ""}
          >
            <FaTag />
            Add Category
          </SubLink>
          <SubLink
            to="/admin/subcategory"
            className={location.pathname === "/admin/subcategory" ? "active" : ""}
          >
            <FaTag />
            Add Sub Category
          </SubLink>
          <SubLink
            to="/admin/products"
            className={location.pathname === "/admin/products" ? "active" : ""}
          >
            <FaBoxOpen />
            Add Product
          </SubLink>
          <SubLink
            to="/admin/products/list"
            className={location.pathname === "/admin/products/list" ? "active" : ""}
          >
            <FaRegListAlt />
            Product List
          </SubLink>
        </SubLinks>
      </SidebarItem>

      {/* Informations Section */}
      <SidebarItem>
        <MainLink onClick={() => setIsInformationsOpen(!isInformationsOpen)}>
          <FaSlidersH />
          <span style={{ marginLeft: "3px" ,marginRight: "30px"}}>Informations</span>
          <span>{isInformationsOpen ? "▲" : "▼"}</span>
        </MainLink>
        <SubLinks isVisible={isInformationsOpen || isInformationsPath}>
          <SubLink
            to="/admin/slidder"
            className={location.pathname === "/admin/slidder" ? "active" : ""}
          >
            <FaSlidersH />
            Slider
          </SubLink>
          <SubLink
            to="/admin/enquiry"
            className={location.pathname === "/admin/enquiry" ? "active" : ""}
          >
            <FaEnvelope />
            Enquiry
          </SubLink>
          <SubLink
            to="/admin/address"
            className={location.pathname === "/admin/address" ? "active" : ""}
          >
            <FaMapMarkerAlt />
            Address
          </SubLink>
          <SubLink
            to="/admin/coupon"
            className={location.pathname === "/admin/coupon" ? "active" : ""}
          >
            <FaTag />
            Coupon
          </SubLink>
        </SubLinks>
      </SidebarItem>

      <SidebarLink
        to="/admin/order"
        className={location.pathname === "/admin/order" ? "active" : ""}
      >
        <FaRegListAlt />
        Manage Order
      </SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
