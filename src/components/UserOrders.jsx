import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const USER_ORDERS_URL = `${import.meta.env.VITE_API_URL}/orders/my-orders`;

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  const handleFetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const response = await fetch(USER_ORDERS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Response status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data);
        setOrders(data.orders || []);
      } else {
        console.error("Failed to fetch orders:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <div>
        <div className="d-flex justify-content-center gap-1 mb-4">
            <Button variant="primary" onClick={() => navigate("/addProduct")}>
            Create New Product
            </Button>
            <Link className="btn btn-success btn-block" to="/all-orders">
            Show All Users Orders
            </Link>
        </div>
        <h1 className="text-center my-4">My Orders</h1>
        <Table striped bordered hover responsive variant="white">
            <thead>
            <tr className="text-center">
                <th>Order ID</th>
                <th>Total Price</th>
                <th>Ordered On</th>
            </tr>
            </thead>
            <tbody>
            {orders.map(order => (
                <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.totalPrice}</td>
                <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    </div>
  );
};

export default UserOrders;