import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const USER_ORDERS_URL = `${import.meta.env.VITE_API_URL}/orders/my-orders`;

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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
    <>
      <div>
        <h1 className="text-center my-4">My Orders</h1>
        <div className="d-flex justify-content-center gap-1 mb-4">
          <Button variant="primary" onClick={() => navigate("/product")}>
            Order New Product
          </Button>
          <Button variant="success" onClick={() => navigate("/cart")}>
            View my Cart
          </Button>
        </div>
        <Table striped bordered hover responsive variant="white">
          <thead>
            <tr className="text-center">
              <th>Order ID</th>
              <th>Total Price</th>
              <th>Ordered On</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.totalPrice}</td>
                  <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default UserOrders;
