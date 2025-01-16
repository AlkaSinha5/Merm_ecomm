import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

// Styled components for layout and design
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const SidebarContainer = styled.div`
  width: 280px;
  background-color: #4a3f46;
  color: #fff;
  min-height: 100vh;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const ContainerAdmin = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

const Heading = styled.h1`
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ active }) => (active ? "#4a3f46" : "#ddd")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    opacity: 0.9;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  padding: 15px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableHead = styled.thead`
  background-color: #4a3f46;
  color: white;

  th {
    padding: 16px;
    text-align: left;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    font-size: 16px;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:nth-child(even) {
      background-color: #f8f8f8;
    }

    &:hover {
      background-color: #f1f1f1;
    }
  }

  td {
    padding: 14px;
    border-bottom: 1px solid #ddd;
    color: #555;
    font-size: 14px;
    word-wrap: break-word;
  }
`;

const ProductsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #444;

  li {
    margin-bottom: 5px;
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const StatusText = styled.span`
  background-color: ${({ status }) => (status === "Yes" ? "#2ecc71" : "#e74c3c")};
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

// Main AdminOrdersPage Component
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});
  const [filter, setFilter] = useState("all"); // Filter state: all, pending, delivered

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/orderAdmin", {
          headers: { Authorization: `Bearer ${localStorage.getItem("krist-app-token")}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchProductDetails = async (productId) => {
    if (productDetails[productId]) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const updateOrderStatus = async (orderId, statusType, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/user/orderupdate/${orderId}`,
        {
          [statusType]: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("krist-app-token")}`,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, [statusType]: newStatus } : order
        )
      );
      console.log(response);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusChange = (orderId, statusType, currentStatus) => {
    const confirmChange = window.confirm("Are you sure you want to update the status?");
    if (confirmChange) {
      const newStatus = !currentStatus;
      updateOrderStatus(orderId, statusType, newStatus);
    }
  };

  // Filtered orders based on the selected filter
  const filteredOrders = orders.filter((order) => {
    if (filter === "pending") return !order.orderDeliverd;
    if (filter === "delivered") return order.orderDeliverd;
    return true;
  });
  const allCount = orders.length;
  const pendingCount = orders.filter((order) => !order.orderDeliverd).length;
  const deliveredCount = orders.filter((order) => order.orderDeliverd).length;
  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>

      <ContainerAdmin>
        <Heading>Admin Orders</Heading>

        <FilterContainer>
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All Orders ({allCount})
          </FilterButton>
          <FilterButton active={filter === "pending"} onClick={() => setFilter("pending")}>
            Pending ({pendingCount})
          </FilterButton>
          <FilterButton active={filter === "delivered"} onClick={() => setFilter("delivered")}>
            Delivered ({deliveredCount})
          </FilterButton>
        </FilterContainer>

        {filteredOrders.length === 0 ? (
          <Message>No orders found.</Message>
        ) : (
          <TableWrapper>
            <Table>
              <TableHead>
                <tr>
                <th>Sl. No.</th>
                  <th>Total Amount</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Order Shipping</th>
                  <th>Order Process</th>
                  <th>Order Delivered</th>
                  <th>Order Cancelled</th>
                  <th>Products</th>
                  <th>Order ID</th>
                </tr>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order,index) => (
                  <tr key={order._id}>
                    <td>{index+1}</td>
                    <td>{order.total_amount.$numberDecimal}</td>
                    <td>{order.address}</td>
                    <td>{order.status}</td>
                    <td>
                      <StatusText
                        status={order.orderShipping ? "Yes" : "No"}
                        onClick={() =>
                          handleStatusChange(order._id, "orderShipping", order.orderShipping)
                        }
                      >
                        {order.orderShipping ? "Yes" : "No"}
                      </StatusText>
                    </td>
                    <td>
                      <StatusText
                        status={order.orderProcess ? "Yes" : "No"}
                        onClick={() =>
                          handleStatusChange(order._id, "orderProcess", order.orderProcess)
                        }
                      >
                        {order.orderProcess ? "Yes" : "No"}
                      </StatusText>
                    </td>
                    <td>
                      <StatusText
                        status={order.orderDeliverd ? "Yes" : "No"}
                        onClick={() =>
                          handleStatusChange(order._id, "orderDeliverd", order.orderDeliverd)
                        }
                      >
                        {order.orderDeliverd ? "Yes" : "No"}
                      </StatusText>
                    </td>
                    <td>
                      <StatusText
                        status={order.orderCancel ? "Yes" : "No"}
                        onClick={() =>
                          handleStatusChange(order._id, "orderCancel", order.orderCancel)
                        }
                      >
                        {order.orderCancel ? "Yes" : "No"}
                      </StatusText>
                    </td>
                    <td>
                      <ProductsList>
                      {order.products.map((item) => {
                          fetchProductDetails(item.product); // Fetch product details dynamically
                          return (
                            
                            <li key={item.product}>
                            {productDetails[item.product]
                              ? ` Name :${productDetails[item.product].name} Quantity: ${item.quantity}`
                              : "Loading..."}
                          </li>
                          );
                        })}
                      </ProductsList>
                    </td>
                    <td>{order._id}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </ContainerAdmin>
    </Container>
  );
};

export default AdminOrdersPage;