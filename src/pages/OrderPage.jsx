import React, { useContext } from 'react';
import UserOrders from '../components/UserOrders';
import AdminOrders from '../components/AdminOrders';
import UserContext from "../context/UserContext";

const OrdersPage = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    console.log("User not found, loading...");
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user.isAdmin ? <AdminOrders /> : <UserOrders />}
    </div>
  );
};

export default OrdersPage;
