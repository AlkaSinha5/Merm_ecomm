import React from "react";
import styled from "styled-components";
// import contactImage from "../assets/contact-image.jpg"; // Replace with your image path

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
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
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    filter: brightness(0.8);
  }
`;

const TextContainer = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;

  h2 {
    font-size: 2.5rem;
    color: #333;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    font-size: 1.2rem;
    color: #666;
    line-height: 1.6;
    text-align: center;

    strong {
      color: #333;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ContactUsPage = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <ImageContainer>
          <img src={"https://www.shutterstock.com/shutterstock/videos/1090041605/thumb/1.jpg?ip=x480"} alt="Contact Us" />
        </ImageContainer>
        <TextContainer>
          <h2>Get in Touch with Us</h2>
          <p>
            We’d love to hear from you! Whether you have a question, concern, or just want to say hello, we're here to assist you.
          </p>
          <p>
            <strong>Phone:</strong> +1 234 567 890
          </p>
          <p>
            <strong>Email:</strong> contact@yourcompany.com
          </p>
          <p>
            <strong>Address:</strong> 123 Business St, Suite 100, City, Country
          </p>
        </TextContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ContactUsPage;
