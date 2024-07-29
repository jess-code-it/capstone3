import { useContext, useEffect, useState } from "react"
import { Button, Card, CardFooter, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import Swal from "sweetalert2"

import UserContext from "../context/UserContext"

export default function Login() {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isActive, setIsActive] = useState(true)

  function authenticate(e) {
    e.preventDefault()
    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access !== undefined) {
          console.log(data.access)

          localStorage.setItem("token", data.access)
          retrieveUserDetails(data.access)

          setEmail("")
          setPassword("")

          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "You are now logged in.",
          })
        } else if (data.message == "Incorrect email or password") {
          Swal.fire({
            title: "Login Failed",
            icon: "error",
            text: "Incorrect email or password.",
          })
        } else {
          Swal.fire({
            title: "User Not Found",
            icon: "error",
            text: `${email} does not exist.`,
          })
        }
      })
  }

  function retrieveUserDetails(token) {
    fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin,
        })

        navigate({ pathname: data.user.isAdmin ? "/admin" : "/product" })
      })
  }

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [email, password])

  return (
    <Form onSubmit={(e) => authenticate(e)}>
      <h1 className="my-4 text-center">Login</h1>
      <div className="form-wrapper">
        <Card className="w-100">
          <Form.Group className="p-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mx-3 mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <CardFooter className="text-muted">
            <Button
              className="w-100"
              variant={isActive ? "primary" : "danger"}
              type="submit"
              id="loginBtn"
              disabled={!isActive}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
      <p className="text-center mt-3">
        Don&apos;t have an account yet? <Link to="/register">Click here</Link>{" "}
        to register.
      </p>
    </Form>
  )
}
