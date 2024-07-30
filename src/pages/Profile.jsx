import React, { useContext, useEffect, useState } from "react"
import { Button, Card, Modal } from "react-bootstrap"
import { Navigate } from "react-router-dom"
import Swal from "sweetalert2"
import UpdatePassword from "../components/UpdatePassword"
import UserContext from "../context/UserContext"

export default function Profile() {
  const { user } = useContext(UserContext)
  const [details, setDetails] = useState({})
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      Swal.fire({
        title: "Authentication Error",
        icon: "error",
        text: "Token not found, please log in again.",
      })
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/b1/users/details`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.user) {
          setDetails(data.user)
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error)
        Swal.fire({
          title: "Fetch Error",
          icon: "error",
          text: `Failed to fetch user details: ${error.message}. Please try again.`,
        })
      })
  }, [])

  if (!user.id) {
    return <Navigate to="/products" />
  }

  return (
    <>
      <h1 className="my-4 text-center">Profile</h1>
      <Card className="mx-auto w-50">
        <div className="profile-wrapper">
          <Card.Body className="text-center">
            <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
            <hr />
            <Card.Text>Email: {details.email} </Card.Text>
            <Card.Text>Mobile No: {details.mobileNo} </Card.Text>

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="mt-3"
                onClick={() => setShowModal(true)}
              >
                Edit Password
              </Button>
            </div>
          </Card.Body>
        </div>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdatePassword />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
