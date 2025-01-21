import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom"; // Assumes you're using react-router-dom

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0px 0px 4px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #7baaf7;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${({ isError }) => (isError ? "#d9534f" : "#5cb85c")};
  text-align: center;
  margin-top: 20px;
`;

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId, token } = useParams(); // Extract userId and token from the URL
  const navigate = useNavigate(); // To redirect after success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/user/reset/${userId}/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset successfully!");
        setIsError(false);
        setTimeout(() => navigate("/"), 1000); // Redirect to login page after 3 seconds
      } else {
        setMessage(data.message || "An error occurred. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Reset Password</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </Form>
      {message && <Message isError={isError}>{message}</Message>}
    </Container>
  );
};

export default ResetPassword;
