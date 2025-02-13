import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import Users from "./pages/UserPage";
import Products from "./pages/Product";
import Dashboard from "./components/Dashboard";
import OrderManagement from "./pages/OrderManagement";
import ProductPage from "./pages/productList";
import EditProductPage from "./pages/productEdit";
import UserOrdersPage from "./pages/Order";
import AdminOrdersPage from "./pages/adminOrderGet";
import AddCategory from "./pages/AddCategory";
import AddSlider from "./pages/Slider";
import HomeSlider from "./components/HomePageSlider";
import AddSubCategory from "./pages/AddSubCategory";
import EnquiriesPage from "./pages/EnquiryGet";
import EditPage from "./pages/addressEdit";
import ProfileUpdate from "./components/profileUpdate";
import AddCoupon from "./pages/AddCoupon";
import UpdatePassword from "./components/updatePassword";
import ForgotPassword from "./components/sendMail";
import ResetPassword from "./components/resetPassword";
import PageNotFound from "./pages/NotFound";


// Styled Components
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
  padding-bottom: 60px;
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

// Main App Component
function App() {
  const { currentUser } = useSelector((state) => state.user); // Accessing Redux state
  const [openAuth, setOpenAuth] = useState(false); // Local state for authentication modal

  return (
    <ThemeProvider theme={lightTheme}>
      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <BrowserRouter>
        <Container>
          {/* Main Content */}
          <MainRoutes
            currentUser={currentUser}
            openAuth={openAuth}
            setOpenAuth={setOpenAuth}
          />
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

// Separate Main Routes Logic
function MainRoutes({ currentUser, openAuth, setOpenAuth }) {
  const location = useLocation(); // Use location to check current path
  const isAdminRoute = location.pathname.startsWith("/admin"); // Identify admin routes
  const isDiffRoute = location.pathname.startsWith("/user");
  return (
    <>
      {/* Render Navbar only for non-admin routes */}
      {!isAdminRoute && <Navbar setOpenAuth={setOpenAuth} currentUser={currentUser} />}

      <MainContent>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopListing />} />
          <Route path="/favorite" element={<Favourite />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/order" element={<UserOrdersPage />} />

          <Route path="/user/userUpdate" element={<ProfileUpdate currentUser={currentUser}/>} />
          <Route path="/user/passwordUpdate" element={<UpdatePassword currentUser={currentUser}/>} />
          <Route path="/user/forgetPasword" element={<ForgotPassword/>} />
          <Route path="/user/resetPasword/:userId/:token" element={<ResetPassword/>} />
           <Route path="*" element ={<PageNotFound/>}></Route>
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/Category" element={<AddCategory />} />
          <Route path="/admin/SubCategory" element={<AddSubCategory />} />
          <Route path="/admin/products/list" element={<ProductPage />} />
          <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
          <Route path="/admin/order" element={<AdminOrdersPage />} />
          <Route path="/admin/slidder" element={<AddSlider />} />
          <Route path="/admin/enquiry" element={<EnquiriesPage />} />
          <Route path="/admin/address" element={<EditPage />} />
          <Route path="/admin/coupon" element={<AddCoupon/>} />
        </Routes>
      </MainContent>

      {/* Render Footer only for non-admin routes */}
      { !isDiffRoute && !isAdminRoute && (
        <FooterStyled>
          <Footer />
        </FooterStyled>
      )}

      {/* Authentication Modal */}
      {openAuth && (
        <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />
      )}
    </>
  );
}
