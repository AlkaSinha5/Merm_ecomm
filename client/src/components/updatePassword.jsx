import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Wrapper = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  
  &:disabled {
    background-color: #ddd;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
`;

const UpdatePassword = ({ currentUser }) => {
  const userId = currentUser?._id;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("krist-app-token"); // Get JWT token from localStorage
    if (!token) {
      toast.error("You must be logged in to update the password");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/user/updatePassword/${userId}`, // Dynamically pass userId here
        {
          OldPassword: oldPassword,
          NewPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message); // Display success message
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
    }

    setLoading(false); // Stop the loading spinner
  };

  return (
    <Container>
      <Wrapper>
        <Title>Update Password</Title>
        <form onSubmit={handleSubmit}>
          <PasswordWrapper>
            <Input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <EyeButton type="button" onClick={() => setShowOldPassword(!showOldPassword)}>
              👁️
            </EyeButton>
          </PasswordWrapper>

          <PasswordWrapper>
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <EyeButton type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
              👁️
            </EyeButton>
          </PasswordWrapper>

          <Button type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="secondary" /> : "Update Password"}
          </Button>
        </form>
      </Wrapper>
    </Container>
  );
};

export default UpdatePassword;
