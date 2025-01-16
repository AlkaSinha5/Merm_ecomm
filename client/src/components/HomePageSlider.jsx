import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import slider styles
import "slick-carousel/slick/slick-theme.css";

// Styled Components
const SliderContainer = styled.div`
  width: 100%;
  margin: 20px auto;
  position: relative;

`;

const SliderImage = styled.img`
  width: 100%;
  height: 350px; /* Adjust height as needed */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
`;

const HomeSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [error, setError] = useState(null);

  // Fetch sliders on component mount
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/slider");
        setSliders(response.data.sliders); // Accessing "sliders" array from the API response
      } catch (err) {
        setError("Failed to load slider images. Please try again.");
      }
    };

    fetchSliders();
  }, []);

  // React-slick settings for the slider
  const sliderSettings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scrolling
    speed: 500, // Animation speed
    slidesToShow: 1, // Number of slides to show
    slidesToScroll: 1, // Number of slides to scroll at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Autoplay speed in milliseconds
    arrows: true, // Show previous/next arrows
  };

  return (
    <SliderContainer>
      {error && <ErrorText>{error}</ErrorText>}
      {sliders.length > 0 ? (
        <Slider {...sliderSettings}>
          {sliders.map((slider) => (
            <div key={slider._id}>
              <SliderImage src={slider.img} alt="Slider" />
            </div>
          ))}
        </Slider>
      ) : (
        <p>No slider images available.</p>
      )}
    </SliderContainer>
  );
};

export default HomeSlider;
