import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import styles for react-confirm-alert
import Sidebar from "../components/SideBar";

// Styled Components for Sidebar and Layout
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;


const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background-color: #4a3f46;
  color: white;

  th {
    padding: 10px;
    text-align: left;
    font-weight: bold;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }

  &:hover {
    background-color: #ddd;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff0000;
  }
`;

// Users Component
const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/get"); // Replace with your API endpoint
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const deleteUser = async (userId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const res = await axios.delete(`http://localhost:8080/api/user/delete/${userId}`); // Replace with your delete API endpoint
              setUsers(users.filter((user) => user._id !== userId)); // Update UI after deletion
              toast.success(res.data.message);
            } catch (error) {
              console.error("Error deleting user:", error);
              toast.error("Failed to delete user.");
            }
          },
        },
        {
          label: "No",
          onClick: () => {}, // Do nothing if "No" is clicked
        },
      ],
    });
  };

  return (
    <Container>
      {/* Sidebar */}
     <Sidebar/>

      {/* Main Content */}
      <MainContent>
        <h1>Users</h1>
        <Table>
          <TableHead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </TableHead>
          <tbody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <TableButton onClick={() => deleteUser(user._id)}>
                    Delete
                  </TableButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <ToastContainer /> {/* Toast container for notifications */}
      </MainContent>
    </Container>
  );
};

export default Users;
