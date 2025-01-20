import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; // Using Redux's dispatch function
import { useNavigate } from "react-router-dom";
import { updateUser } from "../redux/reducers/userSlice"; // Assuming you have an action to update user

const UpdateUser = ({ currentUser }) => {
  const userId = currentUser?._id; // Safeguard in case currentUser is undefined
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch(); // Initialize dispatch to update the Redux state
  const navigate = useNavigate();
  // Fetch user by ID
  useEffect(() => {
    if (!userId) return; // Avoid making the request if userId is not available

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/getById/${userId}`);
        setUser(response.data || { name: "", email: "", photo: "" });
      } catch (err) {
        setError("Failed to fetch user. Please try again.");
      }
    };

    fetchUser();
  }, [userId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  // Update user by ID
  const handleUpdateUser = async () => {
    setLoading(true);
    setError(null);

    const updatedUser = { ...user };

    // Remove photo if not updated (optional)
    if (!user.photo) {
      delete updatedUser.photo;
    }

    try {
      const res = await axios.put(`http://localhost:8080/api/user/update/${userId}`, updatedUser);
      setUser(res.data);  // Update the state with the response data (instant update)

      // Update the global user state (Redux)
      dispatch(updateUser(res.data)); // Dispatch the updated user data to Redux

      alert("User updated successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Inline CSS styles
  const containerStyle = {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const imagePreviewStyle = {
    marginTop: "10px",
    maxWidth: "100%",
    maxHeight: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#598334",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  };

  const buttonDisabledStyle = {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  };

  const errorStyle = {
    color: "red",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      <h2>Profile Update</h2>
      {error && <p style={errorStyle}>{error}</p>}

      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={user.name || ""}
            onChange={handleInputChange}
            placeholder="Enter Name"
            disabled={loading}
            style={inputStyle}
          />
        </label>
      </div>

      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email || ""}
            onChange={handleInputChange}
            placeholder="Enter Email"
            disabled={loading}
            style={inputStyle}
          />
        </label>
      </div>

      <div>
        <label>
          Upload Profile Photo:
          <input
            type="file"
            id="img"
            name="img"
            onChange={handleFileChange}
            disabled={loading}
            style={{ ...inputStyle, padding: "6px" }}
          />
        </label>
      </div>
      {user.photo && (
        <div>
          <h3>Image Preview</h3>
          <img src={user.photo} alt="Preview" style={imagePreviewStyle} />
        </div>
      )}
      <button
        onClick={handleUpdateUser}
        disabled={loading}
        style={loading ? { ...buttonStyle, ...buttonDisabledStyle } : buttonStyle}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default UpdateUser;
