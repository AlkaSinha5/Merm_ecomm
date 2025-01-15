import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

// Styled Components (same as before)
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
    margin-right: 10px;
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

const SubCategoryList = styled.div`
  margin-top: 30px;
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
const Select = styled.select`
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

  option {
    padding: 12px;
  }
`;


const AddSubCategory = () => {
  const [subCategory, setSubCategory] = useState({
    name: "",
    img: "",
    categoryId: "", // Assuming we are linking subcategories to categories
  });
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category");
        setCategories(response.data.categories); // assuming the response has a "categories" field
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories on component mount
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/subcategory");
        setSubCategories(response.data.subcategories); // assuming the response has a "subCategories" field
      } catch (err) {
        setError("Failed to fetch subcategories. Please try again.");
      }
    };

    fetchSubCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubCategory((prev) => ({
          ...prev,
          img: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleAddSubCategory = async () => {
    const { name, img, categoryId } = subCategory;

    if (!name || !img || !categoryId) {
      setError("All fields are required!");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/subcategory/add", {
        name,
        img,
        categoryId,
      });
      console.log("SubCategory added successfully:", response.data);

      // Add the new subcategory to the list
      setSubCategories((prevSubCategories) => [
        ...prevSubCategories,
        response.data.SubCategory,
      ]);

      setSubCategory({ name: "", img: "", categoryId: "" });
    } catch (err) {
      setError("Failed to add SubCategory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/subcategory/${id}`);
      setSubCategories((prevSubCategories) =>
        prevSubCategories.filter((subCat) => subCat._id !== id)
      );
      alert("SubCategory deleted successfully.");
    } catch (err) {
      setError("Failed to delete subcategory. Please try again.");
    }
  };

  const handleEditSubCategory = (id) => {
    const subCategoryToEdit = subCategories.find((subCat) => subCat._id === id);
    setSubCategory({
      name: subCategoryToEdit.name,
      img: subCategoryToEdit.img,
      categoryId: subCategoryToEdit.categoryId,
    });
  };

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <Card>
          <Title>Add SubCategory</Title>
          <FlexContainer>
            {/* Name Input Container */}
            <FormGroup>
              <label htmlFor="name">SubCategory Name</label>
              <Input
                type="text"
                id="name"
                name="name"
                value={subCategory.name}
                onChange={handleInputChange}
                placeholder="Enter SubCategory Name"
              />
            </FormGroup>

            {/* Image Upload Container */}
            <FormGroup>
              <label htmlFor="img">SubCategory Image</label>
              <Input
                type="file"
                id="img"
                name="img"
                onChange={handleFileChange}
                placeholder="Upload SubCategory Image"
              />

              {subCategory.img && (
                <ImagePreview>
                  <img src={subCategory.img} alt="Preview" />
                </ImagePreview>
              )}
            </FormGroup>

            {/* Category Dropdown */}
           <FormGroup>
  <label htmlFor="categoryId">Category</label>
  <Select
    id="categoryId"
    name="categoryId"
    value={subCategory.categoryId}
    onChange={handleInputChange}
  >
    <option value="">Select Category</option>
    {categories.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </Select>
</FormGroup>

          </FlexContainer>

          {error && <ErrorText>{error}</ErrorText>}

          <Button onClick={handleAddSubCategory} disabled={loading}>
            {loading ? "Adding..." : "Submit"}
          </Button>
        </Card>

        <SubCategoryList>
          <Title>SubCategories</Title>
          <Table>
  <thead>
    <tr>
      <TableHeader>Sl. No</TableHeader>
      <TableHeader>Name</TableHeader>
      <TableHeader>Image</TableHeader>
      <TableHeader>Category</TableHeader>
      <TableHeader>Actions</TableHeader>
    </tr>
  </thead>
  <tbody>
    {subCategories.map((subCategory, index) => {
      // Find the category name based on the categoryId
      const category = categories.find((cat) => cat._id === subCategory.categoryId);
      return (
        <TableRow key={subCategory._id}>
          <TableData>{index + 1}</TableData>
          <TableData>{subCategory.name}</TableData>
          <TableData>
            <img
              src={subCategory.img}
              alt={subCategory.name}
              width="50"
              height="50"
            />
          </TableData>
          <TableData>{category ? category.name : "Unknown"}</TableData>
          <TableData>
            <Button className="edit" onClick={() => handleEditSubCategory(subCategory._id)}>
              Edit
            </Button>
            <Button
              className="delete"
              onClick={() => handleDeleteSubCategory(subCategory._id)}
            >
              Delete
            </Button>
          </TableData>
        </TableRow>
      );
    })}
  </tbody>
</Table>

        </SubCategoryList>
      </MainContent>
    </Container>
  );
};

export default AddSubCategory;
