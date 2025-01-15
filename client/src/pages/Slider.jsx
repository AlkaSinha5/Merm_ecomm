import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

// Styled Components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 10px;
  background-color: #f8f9fa;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-top: 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #333333;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fdfdfd;
  border-radius: 10px;
  padding: 20px 40px 20px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3f46;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &:hover {
    border-color: #4a3f46;
  }
`;

const ImagePreview = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`;

const Button = styled.button`
  background-color: #4a3f46;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &.edit {
    background-color: #f0ad4e;
    &:hover {
      background-color: #ec971f;
    }
  }

  &.delete {
    background-color: #d9534f;
    &:hover {
      background-color: #c9302c;
    }
  }
`;

const ErrorText = styled.p`
  color: #d9534f;
  margin-top: 10px;
`;

const SliderList = styled.div`
  margin-top: 30px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 images per row */
  gap: 20px;
  margin-top: 20px;
`;

const ImageItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;

  img {
    width: 100%;
    height: 200px; /* Adjust the image size */
    object-fit: cover;
    border-radius: 8px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 12px 30px 12px 20px;
  background-color: #4a3f46;
  color: white;
  text-align: left;
`;

const TableData = styled.td`
  padding: 12px 30px 12px 20px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const AddSlider = () => {
  const [slider, setSlider] = useState({
    img: "",
  });
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sliders on component mount
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/slider");
        setSliders(response.data.sliders); // assuming the response has a "sliders" field
      } catch (err) {
        setError("Failed to fetch sliders. Please try again.");
      }
    };

    fetchSliders();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlider((prev) => ({
          ...prev,
          img: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleAddSlider = async () => {
    const { img } = slider;

    if (!img) {
      setError("All fields are required!");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/slider/add", {
        img,
      });
      console.log("Slider added successfully:", response.data);

      // Add the new slider to the sliders list
      setSliders((prevSliders) => [
        ...prevSliders,
        response.data.Slider,
      ]);

      setSlider({ img: "" });
    } catch (err) {
      setError("Failed to add Slider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <Card>
          <Title>Add Slider</Title>
          <FlexContainer>
            {/* Image Upload Container */}
            <FormGroup>
              <label htmlFor="img">Slider Image</label>
              <Input
                type="file"
                id="img"
                name="img"
                onChange={handleFileChange}
                placeholder="Upload Slider Image"
              />
              {slider.img && (
                <ImagePreview>
                  <img src={slider.img} alt="Preview" />
                </ImagePreview>
              )}
            </FormGroup>
          </FlexContainer>

          {error && <ErrorText>{error}</ErrorText>}

          <Button onClick={handleAddSlider} disabled={loading}>
            {loading ? "Adding..." : "Submit"}
          </Button>
        </Card>

        <SliderList>
          <Title>Sliders</Title>
          <ImageGrid>
            {sliders.length === 0 ? (
              <p>No sliders available.</p>
            ) : (
              sliders.map((slider) => (
                <ImageItem key={slider._id}>
                  <img src={slider.img} alt={slider.name} />
                </ImageItem>
              ))
            )}
          </ImageGrid>
        </SliderList>
      </MainContent>
    </Container>
  );
};

export default AddSlider;
