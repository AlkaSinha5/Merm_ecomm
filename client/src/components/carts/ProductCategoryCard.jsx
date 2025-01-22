import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  width: 170px;
  display: flex;
   border-radius: 50%;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  @media (max-width: 600px) {
    width: 70px;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s ease-out;
  &:hover {
    opacity: 0.8;
  }
  @media (max-width: 600px) {
    height: 100px;
  }
`;
const Top = styled.div`
  display: flex;
  align-items: center;
   border-radius: 50%;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease-out;
  
`;
const Menu = styled.div`
  width: 90%;
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 10px;
  left: 20;
  right: 20;
  display: flex;
  gap: 10px;
`;
const Button = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.primary};
  padding: 3px 5px;
  background: white;
  border-radius: 10px;
  text-align: center;
  font-weight: 300;
  font-size: 14px; /* Set a smaller font size */
  @media (max-width: 600px) {
  font-weight: 350;
    font-size: 12px; /* Even smaller font size for smaller screens */
    padding: 2px 4px; /* Adjust padding for smaller screens */
  }
`;

const Sale = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  top: 10px;
  right: 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: green;
  padding: 3px 6px;
  border-radius: 4px;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const ProductCategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/shop?category=${category.name}`)}>
      <Top>
        <Image src={category.img} />
        <Menu>
          <Button>{category.name}</Button>
        </Menu>
        {/* <Sale>{category.off}</Sale> */}
      </Top>
    </Card>
  );
};

export default ProductCategoryCard;
