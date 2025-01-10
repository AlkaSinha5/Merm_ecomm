import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { toast } from "react-toastify"; // Import toast for notifications
import axios from "axios"; // Ensure axios is imported
import { useNavigate } from "react-router-dom";
import { UserSignIn } from "../api";


const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const SignIn = ({ onLoginSuccess }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleSignIn = async () => {
    setLoading(true); // Show loading state during API call
    try {
      // const response = await axios.post("http://localhost:8080/api/user/signin", {
      //   email,
      //   password,
      // });
      const response = await UserSignIn({  email, password });
      // Dispatch user data and token to Redux store
      dispatch(loginSuccess(response.data));

      // Trigger success toast
      console.log(response.data.message)
      toast.success(response.data.message);

      // Redirect to the home page
      
      // navigate("/");
       // Redirect to home after login
      //  window.location.href = "/";
      if (response.data.message === "Login Successfully") {
        navigate("/");
      }
      


      // onLoginSuccess(); // Trigger callback for other logic, if needed
    } catch (error) {
      if (error.response && error.response.data) {
        // Display backend error message in the toast
        toast.error(error.response.data.message || "An error occurred");
      } else {
        // Display generic error if no backend message is present
        toast.error(error.message || "Something went wrong");
      } 
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Container>
      <div>
        <Title>Welcome Back 👋</Title>
        <Span>Please enter your credentials to log in</Span>
      </div>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <Button
          text="Sign In"
          onClick={handleSignIn}
          isLoading={loading}
        />
      </div>
    </Container>
  );
};

export default SignIn;
