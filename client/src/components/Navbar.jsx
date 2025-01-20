import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Avatar, Badge, Menu, MenuItem } from "@mui/material";
import { logout } from "../redux/reducers/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";


const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;
const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;
const Logo = styled.img`
  height: 34px;
`;
const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 1s slide-in;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;
const Mobileicons = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 80%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card_light + 99};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DropdownMenu = styled(Menu)`
  .MuiMenuItem-root {
    padding: 8px 16px;
    cursor: pointer;
  }
`;

const Navbar = ({ openAuth, setOpenAuth, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const [favoriteLength, setFavoriteLength] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser._id) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/user/get/${currentUser._id}`
          );
          const userData = response.data.user;
          setCartLength(userData.cartLength || 0);
          setFavoriteLength(userData.favouriteLength || 0);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
  };
  const handleUpdateProfile = () => {
    navigate("/user/userUpdate"); // Redirect to Update Profile page
    handleClose(); // Close the dropdown menu
  };
  const handlePasswordUpdate = () => {
    navigate("/user/passwordUpdate"); // Redirect to Update Profile page
    handleClose(); // Close the dropdown menu
  };
  
  return (
    <Nav>
      <NavbarContainer>
        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>

        <NavLogo style={{ width: "20%" }}>
          <Logo src={LogoImg} />
        </NavLogo>

        <NavItems style={{ width: "60%" }}>
          <Navlink to="/">Home</Navlink>
          <Navlink to="/Shop">Shop</Navlink>
          <Navlink to="/Order">Orders</Navlink>
          <Navlink to="/Contact">Contact</Navlink>
        </NavItems>

        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <Navlink to="/" onClick={() => setIsOpen(!isOpen)}>
              Home
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/Shop">
              Shop
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/Order">
              Orders
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/Contact">
              Contact
            </Navlink>
            {currentUser ? (
              <Button text="Logout" small onClick={() => dispatch(logout())} />
            ) : (
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  gap: "12px",
                }}
              >
                {/* <Button
                  text="Sign Up"
                  outlined
                  small
                  onClick={() => setOpenAuth(!openAuth)}
                /> */}
                <Button
                  text="Sign In"
                  small
                  onClick={() => setOpenAuth(!openAuth)}
                />
              </div>
            )}
          </MobileMenu>
        )}

        <Mobileicons>
          <Navlink to="/search">
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </Navlink>

          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <Badge badgeContent={favoriteLength} color="error">
                  <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
                </Badge>
              </Navlink>
              <Navlink to="/cart">
                <Badge badgeContent={cartLength} color="primary">
                  <ShoppingCartOutlined
                    sx={{ color: "inherit", fontSize: "28px" }}
                  />
                </Badge>
              </Navlink>
              <AvatarContainer>
              <Avatar src={currentUser?.photo || undefined}  // Only use the photo if it's present
               sx={{ color: "inherit",
                fontSize: "28px", // Font size for the fallback letter
                width: "40px", // Adjust the width for the avatar
                height: "40px", // Adjust the height for the avatar
                cursor: "pointer", }}
               onClick={handleAvatarClick}
                   >
             {currentUser?.photo ? null : currentUser?.name[0]}  {/* Show first letter if photo is not available */}
  </Avatar>
                <DropdownMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  <MenuItem onClick={handleUpdateProfile}>
                    Update Profile
                  </MenuItem>
                  <MenuItem onClick={handlePasswordUpdate}>
                    Password Update
                  </MenuItem>
                </DropdownMenu>
              </AvatarContainer>
            </>
          ) : (
            <Button
              text="SignIn"
              small
              onClick={() => setOpenAuth(!openAuth)}
            />
          )}
        </Mobileicons>

        <ButtonContainer style={{ width: "20%" }}>
          <Navlink to="/search">
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </Navlink>

          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <Badge badgeContent={favoriteLength} color="error">
                  <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
                </Badge>
              </Navlink>
              <Navlink to="/cart">
                <Badge badgeContent={cartLength} color="primary">
                  <ShoppingCartOutlined
                    sx={{ color: "inherit", fontSize: "28px" }}
                  />
                </Badge>
              </Navlink>
              <AvatarContainer>
              <Avatar src={currentUser?.photo || undefined}  // Only use the photo if it's present
               sx={{ color: "inherit",
                fontSize: "28px", // Font size for the fallback letter
                width: "60px", // Adjust the width for the avatar
                height: "60px", // Adjust the height for the avatar
                cursor: "pointer", }}
               onClick={handleAvatarClick}
                   >
             {currentUser?.photo ? null : currentUser?.name[0]}  {/* Show first letter if photo is not available */}
  </Avatar>
                {/* <Button text="Logout" small onClick={handleLogout} /> */}
              </AvatarContainer>
            </>
          ) : (
            <>
              {/* <Button
                text="SignUp"
                outlined
                small
                onClick={() => setOpenAuth(!openAuth)}
              /> */}
              <Button
                text="SignIn"
                small
                onClick={() => setOpenAuth(!openAuth)}
              />
            </>
          )}
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
