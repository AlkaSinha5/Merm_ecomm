import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.text_primary || "#333"};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.primary || "#007bff"};
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primaryHover || "#0056b3"};
  }
`;

const ProfileUpdate = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch current user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/getById/${currentUser._id}`);
        const user = response.data;

        // Set the fetched user data to the form state
        setFormData({
          name: user.name,
          email: user.email,
          password: "", // We don't pre-fill password for security reasons
        });

        // Set image preview (assuming photo is a URL)
        setImagePreview(user.photo ? user.photo : null);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [currentUser._id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // This will set the preview
    };
    if (file) {
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    if (formData.password) form.append("password", formData.password);
    if (image) form.append("photo", image); // Send the image as "photo"

    try {
      const response = await axios.put(
        `http://localhost:8080/api/user/update/${currentUser._id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        // Update the currentUser state with the new user data from the response
        setFormData({
          name: response.data.updatedUser.name,
          email: response.data.updatedUser.email,
          password: "", // Optionally clear password field
        });

        // Optionally update image preview with the new image path if the image was updated
        setImagePreview(response.data.updatedUser.photo);

        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile!");
    }
  };

  return (
    <Container>
      <Title>Update Profile</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleInputChange}
        />

        {/* Display current image or selected image */}
        {imagePreview && <img src={imagePreview} alt="Profile Preview" width="100" />}
        
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <Button type="submit">Update Profile</Button>
      </Form>
    </Container>
  );
};

export default ProfileUpdate;
