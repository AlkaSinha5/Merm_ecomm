import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const UserSignUp = async (data) => await API.post("/user/signup", data);
export const UserSignIn = async (data) => await API.post("/user/signin", data);

//Products
export const getAllProducts = async (filter) =>
  await API.get(`/products?${filter}`);

export const getProductDetails = async (id) => await API.get(`/products/${id}`);

//Cart

export const getCart = async (token) =>
  await API.get("/user/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = async (token, data) =>{
  console.log(data)
   return await API.post(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const deleteFromCart = async (token, data) =>
  await API.patch(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Favourites

export const getFavourite = async (token) =>
  await API.get(`/user/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const addToFavourite = async (token, data) => {
    // Log the data being passed to the function
    console.log("data addtoFav", data);
  
    // Make the API request and return the response
    return await API.post(`/user/favorite/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  

export const deleteFromFavourite = async (token, data) =>
  await API.patch(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Orders

export const placeOrder = async (token, data) =>
  await API.post(`/user/order/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrders = async (token) =>
  await API.get(`/user/order/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const getCategories = async () => {
    try {
      const response = await API.get('/category');
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  export const applyCoupon = async (token, { subtotal, couponCode }) => {
    try {
      // Send request with subtotal and couponCode
      const response = await API.post('/coupon/apply', { subtotal, couponCode }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      return response.data; // Returning the response data, which should include the discount and discounted total
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw new Error(error.response?.data?.message || 'An error occurred while applying the coupon.');
    }
  };
  
