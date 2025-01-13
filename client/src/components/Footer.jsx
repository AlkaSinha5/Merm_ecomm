import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";

const FooterContainer = styled.footer`
  width: 100%; /* Ensures the footer spans the entire screen width */
  background-color:#B0BEC5;
  color: #fff;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box; /* Includes padding in the total width */
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
    color:  #000000;
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
      color: #fff;
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
  return (
    <FooterContainer>
      <FooterContent>
        <LogoSection>
        <Logo src={LogoImg} />
          <p>Building great experiences.</p>
        </LogoSection>

        <LinksSection>
          <h3 style ={{color:"#008000"}}>Quick Links</h3>
          <ul>
            <li><a href="/Shop">Shop</a></li>
            <li><a href="/Order">Order</a></li>
            <li><a href="/contact">Contact</a></li>
          
          </ul>
        </LinksSection>

        <ContactSection>
          <h3 style={{ color: "#008000" }}>Contact Us</h3>
          <p>Email: support@mybrand.com</p>
          <p>Phone: +1 234 567 890</p>
          <SocialIcons>
            <a href="https://facebook.com">🌐</a>
            <a href="https://twitter.com">🌐</a>
            <a href="https://instagram.com">🌐</a>
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
