import React, { useState } from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 2.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    text-align: center;
  }

  @media (max-width: 768px) {
    margin-right: 0;
    text-align: center;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #777;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3f46;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px 10px;
  height: 150px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3f46;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  padding: 15px;
  font-size: 1.2rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #333;
  }
`;

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/enquiry/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.");
      }

      const data = await response.json();
      setSuccessMessage("Your enquiry has been submitted successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <LeftSection>
          <h2 style={{ color: "green" }}>Contact Us</h2>
          <p>
            We’d love to hear from you! Whether you have a question, concern, or just want to say hello, we’re here to assist you.
          </p>
        </LeftSection>

        <RightSection>
          <form onSubmit={handleSubmit}>
            <InputWrapper>
              <InputIcon>
                <i className="fas fa-user"></i> {/* User icon for name */}
              </InputIcon>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputWrapper>

            <InputWrapper>
              <InputIcon>
                <i className="fas fa-envelope"></i> {/* Email icon */}
              </InputIcon>
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>

            <InputWrapper>
              <InputIcon>
                <i className="fas fa-comment"></i> {/* Message icon */}
              </InputIcon>
              <TextArea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </InputWrapper>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </SubmitButton>
          </form>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </RightSection>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ContactUsPage;
