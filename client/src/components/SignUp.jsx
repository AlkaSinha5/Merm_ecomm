import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { UserSignUp } from "../api";
import { toast } from "react-toastify"; 

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

const SignUp = ({ setOpenAuth, navigate, setLogin }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState("");

  const validateInputs = () => {
    if (!name || !email || !password) {
      setInputError("Please fill in all fields!");
      return false;
    }
    if (password.length < 6) {
      setInputError("Password must be at least 6 characters!");
      return false;
    }
    setInputError(""); // Clear any previous errors
    return true;
  };

  const handleSignUp = async () => {
    setLoading(true);
    if (validateInputs()) {
      try {
        const res = await UserSignUp({ name, email, password });

        // Show success toast
        toast.success(res.data.message);

        // Switch to login view
        setLogin(true); // Switch to login screen after signup

        // Optionally, close the modal (if required)
        setOpenAuth(false);
      } catch (err) {
        setLoading(false);

        // Show error toasts based on the error response
        if (err.response?.status === 409) {
          toast.error(err.message || "User already exists!");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    } else {
      setLoading(false);
      // Show validation error toast (only if inputs are invalid)
      if (inputError) {
        toast.error(inputError);
      }
    }
  };

  return (
    <Container>
      <div>
        <Title>Join Us 🎉</Title>
        <Span>Enter your details to create your account</Span>
      </div>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Create a password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <Button text="Sign Up" onClick={handleSignUp} isLoading={loading} />
      </div>
    </Container>
  );
};

export default SignUp;
