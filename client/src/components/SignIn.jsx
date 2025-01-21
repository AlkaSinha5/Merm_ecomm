import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { toast } from "react-toastify";
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
const ForgotPasswordLink = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;
const SignIn = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleForgotPassword = () => {
    navigate("/user/forgetPasword"); // Navigate to a "Forgot Password" page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  };

  const handleSignIn = async () => {
    setLoading(true); // Show loading state during API call
    try {
      const response = await UserSignIn({ email, password });
    console.log(response)
      // Dispatch user data and token to Redux store
      dispatch(loginSuccess(response.data));

      // Trigger success toast
      toast.success(response.data.message);

      // Check user role and navigate accordingly
      const { role } = response.data.user; // Assuming the role is present in `response.data.user`
      if (role === "admin") {
        navigate("/admin/dashboard");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      // Call onLoginSuccess callback if needed
      onLoginSuccess && onLoginSuccess();
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
        <Button text="Sign In" onClick={handleSignIn} isLoading={loading} />
      </div>
      <ForgotPasswordLink onClick={handleForgotPassword}>
        Forgot Password?
      </ForgotPasswordLink>
    </Container>
  );
};

export default SignIn;
