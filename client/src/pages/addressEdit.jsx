import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
`;
const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #4a3f46;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
  padding-top: 20px;
`;
const ContentWrapper = styled.div`
margin-left: 250px; /* Space for the fixed sidebar */
  flex-grow: 1;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Allow scrolling */
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
    outline: none;
  }

  &:hover {
    border-color: #9e9e9e;
  }
`;

const ButtonWrapper = styled.div`
  grid-column: span 3;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  padding: 14px 20px;
  background-color: #4a3f46;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.02);
  }

  &:active {
    background-color: #388e3c;
    transform: scale(1);
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: -10px;
  grid-column: span 3;
`;

const SuccessMessage = styled.p`
  color: #388e3c;
  font-size: 0.9rem;
  margin-top: -10px;
  grid-column: span 3;
`;

const EditPage = () => {
  const [formData, setFormData] = useState({
    _id: "",
    mobile: "",
    about: "",
    email: "",
    address: "",
    facebookLink: "",
    instagramLink: "",
    youtubeLink: "",
    twitterLink: "",
    linkedinLink: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/address");
        const data = await response.json();
        if (data && data.length > 0) {
          setFormData(data[0]); // Assuming only one address exists
        } else {
          setErrorMessage("No address data found.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch data. Please try again later.");
      }
    };

    fetchDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!formData._id) {
        setErrorMessage("Address ID is missing. Cannot update data.");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/address/update/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update data.");
      }

      setSuccessMessage("Details updated successfully!");
    } catch (error) {
      setErrorMessage("An error occurred while updating the details.");
    }
  };

  return (
    <PageContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <ContentWrapper>
        <h2>Edit Address</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="about">About</Label>
            <Input
              type="text"
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="facebookLink">Facebook Link</Label>
            <Input
              type="url"
              id="facebookLink"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="instagramLink">Instagram Link</Label>
            <Input
              type="url"
              id="instagramLink"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="youtubeLink">YouTube Link</Label>
            <Input
              type="url"
              id="youtubeLink"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="twitterLink">Twitter Link</Label>
            <Input
              type="url"
              id="twitterLink"
              name="twitterLink"
              value={formData.twitterLink}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="linkedinLink">LinkedIn Link</Label>
            <Input
              type="url"
              id="linkedinLink"
              name="linkedinLink"
              value={formData.linkedinLink}
              onChange={handleInputChange}
            />
          </FormGroup>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          <ButtonWrapper>
            <Button type="submit">Update</Button>
          </ButtonWrapper>
        </Form>
      </ContentWrapper>
    </PageContainer>
  );
};

export default EditPage;
