import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f7f7f7;
`;

const SidebarWrapper = styled.div`
  width: 250px;
  background-color: #4a3f46;
  color: white;
  padding: 20px;
  position: fixed;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100px; /* Collapse the sidebar on smaller screens */
  }
`;

const ContentWrapper = styled.div`
  margin-left: 280px; /* Offset for the sidebar */
  flex: 1;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 100px; /* Adjust for the collapsed sidebar */
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  background-color: #4a3f46;
  color: white;
  font-size: 1.1rem;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableData = styled.td`
  padding: 12px 15px;
  text-align: left;
  font-size: 1rem;
`;

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/enquiry");

        if (!response.ok) {
          throw new Error("Could not fetch enquiries.");
        }

        const data = await response.json();
        setEnquiries(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <PageContainer>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <ContentWrapper>
        <h2>Enquiries List</h2>
        {loading ? (
          <p>Loading enquiries...</p>
        ) : errorMessage ? (
          <p style={{ color: "red" }}>{errorMessage}</p>
        ) : (
          <Table>
            <thead>
              <tr>
              <TableHeader>Sl. No</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Message</TableHeader>
                <TableHeader>Date</TableHeader>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <TableData colSpan="4">No enquiries available.</TableData>
                </tr>
              ) : (
                enquiries.map((enquiry,index) => (
                  <TableRow key={enquiry._id}>
                    <TableData>{index+1}</TableData>
                    <TableData>{enquiry.name}</TableData>
                    <TableData>{enquiry.email}</TableData>
                    <TableData>{enquiry.message}</TableData>
                    <TableData>{new Date(enquiry.date).toLocaleString()}</TableData>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default EnquiriesPage;
