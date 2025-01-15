import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HeaderImage from "../utils/Images/Header.png";
import { category } from "../utils/data";
import ProductCategoryCard from "../components/carts/ProductCategoryCard";
import ProductCard from "../components/carts/ProductCard";
// import Footer from "../components/Footer";
import { getAllProducts } from "../api";
import HomeSlider from "../components/HomePageSlider";

const Container = styled.div`
  padding: 20px 0px 20px 0px; /* Reduced bottom padding */
  height: auto; /* Removed fixed height */
  overflow-y: auto; /* Changed to auto */
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: -65px;
`;

const Img = styled.img`
  width: 90%;
  max-height: 700px; /* Added max-height */
  object-fit: cover;
  max-width: 1200px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  @media (max-width: 750px) {
    gap: 14px;
  }
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    await getAllProducts().then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      {/* Header Section */}
      <Section >
        <HomeSlider/>
        
      </Section>

      {/* Categories Section */}
      <Section>
        <Title center>Shop by Categories</Title>
        <CardWrapper>
          {category.map((category) => (
            <ProductCategoryCard key={category.id} category={category} />
          ))}
        </CardWrapper>
      </Section>

      {/* Best Seller Section */}
      <Section>
        <Title center>Our BestSeller</Title>
        <CardWrapper>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CardWrapper>
      </Section>

      {/* Uncomment Footer if needed */}
      {/* <Footer /> */}
    </Container>
  );
};

export default Home;
