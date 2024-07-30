import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import {Navigate, Route, BrowserRouter as Router, Routes,} from "react-router-dom"
import AdminDashboard from "./components/AdminDashboard"
import AppNavbar from "./components/AppNavbar"
import { UserProvider } from "./context/UserContext"
import AddProduct from "./pages/AddProduct"
import Cart from "./pages/Cart"
import Error from "./pages/Error"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import ProductCatalog from "./pages/ProductCatalog"
import ProductDetails from "./pages/ProductDetails"
import Profile from "./pages/Profile"
import Register from "./pages/Registration"
import OrderPage from "./pages/OrderPage"

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser({ id: data.user._id, isAdmin: data.user.isAdmin })
        } else {
          setUser({ id: null, isAdmin: null })
        }
      })
  }, [])
  return (
    <UserProvider value={{ user, setUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="*" element={<Error />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/product" element={<ProductCatalog />} />
            <Route path="/my-orders" element={<OrderPage />} />
            <Route path="/all-orders" element={<OrderPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route
              path="/admin"
              element={
                user && user.isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  )
}

export default App
