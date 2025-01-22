import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HeaderImage from "../utils/Images/Header.png";
// import { category } from "../utils/data";
import ProductCategoryCard from "../components/carts/ProductCategoryCard";
import ProductCard from "../components/carts/ProductCard";
// import Footer from "../components/Footer";
import { getAllProducts, getCategories } from "../api"; 
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
  width: 100%; /* Ensure the wrapper itself takes the full width of its container */
  
  @media (min-width: 751px) {
    > * { 
      flex: 1 1 calc(20% - 24px); /* Two cards per row, accounting for the gap */
      max-width: calc(20% - 24px); /* Max width of each card */
    }
  }

  @media (max-width: 750px) {
    gap: 14px;

    > * { 
      flex: 1 1 45%; /* Full width for smaller screens */
      max-width: 45%; /* Prevent overflow */
    }
  }
`;
const CardWrapperCategory = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
   border-radius: 50%;
  width: 100%; /* Ensure the wrapper itself takes the full width of its container */
  
  @media (min-width: 751px) {
    > * { 
      flex: 1 1 10% ; /* Two cards per row, accounting for the gap */
      max-width: 10% ; /* Max width of each card */
    }
  }

  @media (max-width: 750px) {
    gap: 14px;

    > * { 
      flex: 1 1 30%; /* Full width for smaller screens */
      max-width: 30%; /* Prevent overflow */
    }
  }
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories

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

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      console.log(res.data.categories)
      setCategories(res.data.categories); // Update the categories state with the fetched data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
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
        <CardWrapperCategory>
          {categories.map((category) => (
            <ProductCategoryCard key={category.id} category={category} />
          ))}
        </CardWrapperCategory>
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
