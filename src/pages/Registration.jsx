import { useEffect, useState } from "react"
import { Button, Card, CardFooter, Form } from "react-bootstrap"
import { Link, Navigate } from "react-router-dom"
import Swal from "sweetalert2"

function Register() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [mobileNo, setMobileNo] = useState(0)
  const [password, setPassword] = useState("")
  const [verifyPassword, setVerifyPassword] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  // const handlePopulate = () => {
  //   setEmail("a@mail.com")
  //   setFirstName("a")

  //   setLastName("a")

  //   setMobileNo("09121111111")
  //   setPassword("12345678")
  //   setVerifyPassword("12345678")
  // }

  const registerUser = (e) => {
    e.preventDefault()
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      verifyPassword !== "" &&
      password === verifyPassword &&
      mobileNo.length === 11
    ) {
      fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobileNo,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.message)
          if (data.message === "Registered successfully") {
            setEmail("")
            setPassword("")
            setVerifyPassword("")
            setIsRegistered(true)

            Swal.fire({
              title: "Registration Successful",
              icon: "success",
              text: "Thank you for registering!",
            })
          } else {
            Swal.fire({
              title: "Something went wrong.",
              icon: "error",
              text: "Please try again later or contact us for assistance",
            })
          }
        })
    }
  }

  useEffect(() => {
    if (
      email !== "" &&
      password !== "" &&
      verifyPassword !== "" &&
      password === verifyPassword
    ) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [email, password, verifyPassword])

  if (isRegistered) {
    return <Navigate to="/login" />
  }

  return (
    <Form onSubmit={registerUser}>
      <h1 className="my-4 text-center">Register</h1>
      <div className="form-wrapper">
        <Card>
          <Form.Group className="p-3">
            <Form.Group>
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile No:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter 11 Digit No."
                required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Verify Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Verify Password"
                required
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </Form.Group>

            {/* <Button variant="primary" onClick={handlePopulate}>
          Pre-populate
        </Button> */}
          </Form.Group>
          <CardFooter className="text-muted">
            <Button
              className="w-100"
              variant={isActive ? "primary" : "danger"}
              type="submit"
              id="regBtn"
              disabled={!isActive}
            >
              Please Enter your Registration details
            </Button>
          </CardFooter>
        </Card>
      </div>
      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Click here</Link> to log in.
      </p>
    </Form>
  )
}

export default Register
