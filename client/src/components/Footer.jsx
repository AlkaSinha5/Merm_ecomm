import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import LogoImg from "../utils/Images/Logo.png";

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #c6c6c6;
  color: #fff;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const LogoSection = styled.div`
  flex: 1;

  p {
    margin-top: 10px;
    color: #000000;
  }
`;

const Logo = styled.img`
  height: 34px;
`;

const LinksSection = styled.div`
  flex: 1;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin: 5px 0;
    }

    a {
      color: #000000;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ContactSection = styled.div`
  flex: 1;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
    color: #000000;
  }
`;

const SocialIcons = styled.div`
  margin-top: 10px;

  a {
    margin-right: 10px;
    font-size: 1.5rem;
    color: #f9a825;
    text-decoration: none;

    &:hover {
      color: #008000;
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid #444;
  color: #000000;

  p {
    font-size: 0.9rem;
  }
`;

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/address");
        if (!response.ok) {
          throw new Error("Failed to fetch footer data.");
        }
        const data = await response.json();
        setFooterData(data[0]); // Assuming only one record is returned
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return <p>Loading footer...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <FooterContainer>
      <FooterContent>
        <LogoSection>
          <Logo src={LogoImg} />
          <p>{footerData.about}</p>
        </LogoSection>

        <LinksSection>
          <h3 style={{ color: "#008000" }}>Quick Links</h3>
          <ul>
            <li><a href="/Shop">Shop</a></li>
            <li><a href="/Order">Order</a></li>
            <li><a href="/Contact">Contact</a></li>
          </ul>
        </LinksSection>

        <ContactSection>
          <h3 style={{ color: "#008000" }}>Contact Us</h3>
          <p>Email: {footerData.email}</p>
          <p>Phone: {footerData.mobile}</p>
          <p>Address: {footerData.address}</p>
          <SocialIcons>
            <a href={footerData.facebookLink} target="_blank" rel="noopener noreferrer" title="Facebook">
              <FaFacebookF />
            </a>
            <a href={footerData.twitterLink} target="_blank" rel="noopener noreferrer" title="Twitter">
              <FaTwitter />
            </a>
            <a href={footerData.youtubeLink} target="_blank" rel="noopener noreferrer" title="YouTube">
              <FaYoutube />
            </a>
            <a href={footerData.instagramLink} target="_blank" rel="noopener noreferrer" title="Instagram">
              <FaInstagram />
            </a>
            <a href={footerData.linkedinLink} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FaLinkedin />
            </a>
          </SocialIcons>
        </ContactSection>
      </FooterContent>

      <FooterBottom>
        <p>© 2025 MyBrand. All Rights Reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
