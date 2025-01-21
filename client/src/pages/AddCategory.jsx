import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

// Styled Components (same as before)
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px; /* Set sidebar width */
  height: 100%;
  background-color: #4a3f46; /* Adjust the sidebar color */
  padding-top: 20px;
`;

const MainContent = styled.div`
  margin-left: 250px; /* Space for the fixed sidebar */
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto; /* Allow scrolling in main content */
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

const CategoryList = styled.div`
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

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: "",
    img: "",
    id: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory((prev) => ({
          ...prev,
          img: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleAddOrUpdateCategory = async () => {
    const { name, img, id } = category;

    if (!name || !img) {
      setError("All fields are required!");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (id) {
        // If an ID is present, update the existing category
        const response = await axios.put(`http://localhost:8080/api/category/update/${id}`, { name, img });

        // Update the category list with the updated category
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === id ? { ...cat, name, img } : cat
          )
        );
      } else {
        // Add a new category
        const response = await axios.post("http://localhost:8080/api/category/add", { name, img });

        // Add the new category to the categories list
        setCategories((prevCategories) => [...prevCategories, response.data.Category]);
      }

      setCategory({ name: "", img: "", id: null }); // Clear the form
    } catch (err) {
      setError("Failed to add or update category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    // Show confirmation before deletion
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return; // Abort deletion if not confirmed

    try {
      await axios.delete(`http://localhost:8080/api/category/delete/${id}`);
      setCategories((prevCategories) => prevCategories.filter((cat) => cat._id !== id));
      alert("Category deleted successfully.");
    } catch (err) {
      setError("Failed to delete category. Please try again.");
    }
  };

  const handleEditCategory = (id) => {
    const categoryToEdit = categories.find((cat) => cat._id === id);
    setCategory({
      name: categoryToEdit.name,
      img: categoryToEdit.img,
      id: categoryToEdit._id, // Store the category ID
    });
  };

  return (
    <Container>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContent>
        <Card>
          <Title>{category.id ? "Edit Category" : "Add Category"}</Title>
          <FlexContainer>
            {/* Name Input Container */}
            <FormGroup>
              <label htmlFor="name">Category Name</label>
              <Input
                type="text"
                id="name"
                name="name"
                value={category.name}
                onChange={handleInputChange}
                placeholder="Enter Category Name"
              />
            </FormGroup>

            {/* Image Upload Container */}
            <FormGroup>
              <label htmlFor="img">Category Image</label>
              <Input
                type="file"
                id="img"
                name="img"
                onChange={handleFileChange}
                placeholder="Upload Category Image"
              />

              {category.img && (
              <ImagePreview>
                  <img src={category.img} alt="Preview" />
              </ImagePreview>
              )}
            </FormGroup>
          </FlexContainer>

          {error && <ErrorText>{error}</ErrorText>}

          <Button onClick={handleAddOrUpdateCategory} disabled={loading}>
            {loading ? "Processing..." : category.id ? "Update" : "Submit"}
          </Button>
        </Card>

        <CategoryList>
          <Title>Categories</Title>
          <Table>
            <thead>
              <tr>
                <TableHeader>Sl. No.</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Image</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <TableRow key={category._id}>
                  <TableData>{index + 1}</TableData>
                  <TableData>{category.name}</TableData>
                  <TableData>
                    <img
                      src={category.img}
                      alt={category.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </TableData>
                  <TableData>
                    <Button className="edit" onClick={() => handleEditCategory(category._id)}>
                      Edit
                    </Button>
                    <Button className="delete" onClick={() => handleDeleteCategory(category._id)}>
                      Delete
                    </Button>
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CategoryList>
      </MainContent>
    </Container>
  );
};

export default AddCategory;
