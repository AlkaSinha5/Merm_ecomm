import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ShopListing from "./pages/ShopListing";
import Favourite from "./pages/Favourite";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import { useState } from "react";
import Authentication from "./pages/Authentication";
import ContactUsPage from "./pages/Contact";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/UserPage";
import Products from "./pages/Product";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 0.2s ease;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding-bottom: 60px; /* Ensure content doesn't overlap footer */
`;

const FooterStyled = styled.footer`
  width: 100%;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.bg_secondary};
  text-align: center;
  position: relative;
  bottom: 0;
  left: 0;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user); // Accessing Redux state
  const [openAuth, setOpenAuth] = useState(false); // Local state for authentication modal

  return (
    <ThemeProvider theme={lightTheme}>
      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <BrowserRouter>
        <Container>
          {/* Navbar Component */}
          <Navbar setOpenAuth={setOpenAuth} currentUser={currentUser} />

          {/* Main Content (All Routes) */}
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopListing />} />
              <Route path="/favorite" element={<Favourite />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shop/:id" element={<ProductDetails />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/users" element={<Users/>} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </MainContent>

          {/* Authentication Modal */}
          {openAuth && (
            <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />
          )}

          {/* Footer */}
          <FooterStyled>
            <Footer />
          </FooterStyled>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
