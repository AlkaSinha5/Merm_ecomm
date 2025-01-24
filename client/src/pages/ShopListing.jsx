import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/carts/ProductCard";
import styled from "styled-components";
import { filter } from "../utils/data";
import { CircularProgress, Slider } from "@mui/material";
import { getAllProducts, getCategories } from "../api"; // Add getCategories API call

const Container = styled.div`
  padding: 20px 30px;
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
    flex-direction: column;
    overflow-y: scroll;
  }
  background: ${({ theme }) => theme.bg};
`;

const Filters = styled.div`
  width: 100%;
  height: fit-content;
  overflow-y: hidden;
  padding: 20px 16px;
  @media (min-width: 768px) {
    height: 100%;
    width: 230px;
    overflow-y: scroll;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Products = styled.div`
  padding: 12px;
  overflow: hidden;
  height: fit-content;
  @media (min-width: 768px) {
    width: 100%;
    overflow-y: scroll;
    height: 100%;
  }
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

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectableItem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_secondary + 90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({ selected, theme }) =>
    selected &&
    `
  border: 1px solid ${theme.text_primary};
  color: ${theme.text_primary};
  background: ${theme.text_primary + 30};
  font-weight: 500;
  `}
`;

const ShopListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L", "XL"]); // Default selected sizes
  const [selectedCategories, setSelectedCategories] = useState([]); // Default selected categories

  const location = useLocation();

  const getFilteredProductsData = async () => {
    setLoading(true);
    await getAllProducts(
      `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}${
        selectedSizes.length > 0 ? `&sizes=${selectedSizes.join(",")}` : ""
      }${
        selectedCategories.length > 0
          ? `&categories=${selectedCategories.join(",")}`
          : ""
      }`
    ).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      console.log(res.data.categories)
      setCategories(res.data.categories); // Update the categories state with the fetched data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const parseQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
      // Find the category ID based on the name
      const matchedCategory = categories.find(
        (cat) => cat.name.toLowerCase() === category.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategories([matchedCategory._id]);
      }
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      parseQueryParams();
    }
  }, [categories, location.search]);

  useEffect(() => {
    getFilteredProductsData();
  }, [priceRange, selectedSizes, selectedCategories]);

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Filters>
            <Menu>
              {/* Filter Section */}
              <FilterSection>
                <Title>Category</Title>
                <Item>
                  {categories.map((item) => (
                    <SelectableItem
                      key={item._id}
                      selected={selectedCategories.includes(item._id)}
                      onClick={() =>
                        setSelectedCategories((prevCategories) =>
                          prevCategories.includes(item._id)
                            ? prevCategories.filter(
                                (category) => category !== item._id
                              )
                            : [...prevCategories, item._id]
                        )
                      }
                    >
                      {item.name}
                    </SelectableItem>
                  ))}
                </Item>
              </FilterSection>

              {/* Price and Size Filters */}
              {filter.map((filters) =>
                filters.value !== "category" ? (
                  <FilterSection key={filters.name}>
                    <Title>{filters.name}</Title>
                    {filters.value === "price" ? (
                      <Slider
                        aria-label="Price"
                        defaultValue={priceRange}
                        min={0}
                        max={2000}
                        valueLabelDisplay="auto"
                        marks={[
                          { value: 0, label: "$0" },
                          { value: 2000, label: "$2000" },
                        ]}
                        onChange={(e, newValue) => setPriceRange(newValue)}
                      />
                    ) : filters.value === "size" ? (
                      <Item>
                        {filters.items.map((item) => (
                          <SelectableItem
                            key={item}
                            selected={selectedSizes.includes(item)}
                            onClick={() =>
                              setSelectedSizes((prevSizes) =>
                                prevSizes.includes(item)
                                  ? prevSizes.filter(
                                      (category) => category !== item
                                    )
                                  : [...prevSizes, item]
                              )
                            }
                          >
                            {item}
                          </SelectableItem>
                        ))}
                      </Item>
                    ) : null}
                  </FilterSection>
                ) : null
              )}
            </Menu>
          </Filters>

          <Products>
            <CardWrapper>
              {products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </CardWrapper>
          </Products>
        </>
      )}
    </Container>
  );
};

export default ShopListing;
