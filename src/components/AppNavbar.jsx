import { useContext } from "react"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { Link, NavLink } from "react-router-dom"
import UserContext from "../context/UserContext"

export default function AppNavbar() {
  const { user } = useContext(UserContext)

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            alt=""
            src={"/image/logo.png"}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Capstone 3
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact="true">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/product" exact="true">
              Products
            </Nav.Link>
            {user && user.id !== null && user.id !== undefined ? (
              user.isAdmin ? (
                <>
                  <Nav.Link as={Link} to="/admin">
                    Admin Dashboard
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/logout" exact="true">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                    <Nav.Link as={NavLink} to="/cart" exact="true">Cart</Nav.Link>
                    <Nav.Link as={NavLink} to="/my-orders" exact="true">Orders</Nav.Link>
                    <Nav.Link as={NavLink} to="/profile" exact="true">Profile</Nav.Link>
                    <Nav.Link as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
                </>
              )
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" exact="true">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" exact="true">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
