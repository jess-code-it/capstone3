import { useContext, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import UserContext from "../context/UserContext"

export default function AddProduct() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")

  async function addProduct(e) {
    e.preventDefault()

    let token = localStorage.getItem("token")

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: url,
          name: name,
          description: description,
          price: price,
        }),
      })

      const data = await response.json()

      console.log(data)

      if (data.message === "Product already exists") {
        Swal.fire({
          title: "Product Creation Error",
          icon: "error",
          text: "Product already exists.",
        })
      } else if (data.success === true) {
        setName("")
        setDescription("")
        setPrice("")

        Swal.fire({
          title: "Product Creation Successful",
          icon: "success",
          text: "Product Added successfully.",
        })

        navigate("/admin")
      } else {
        Swal.fire({
          title: "Product Creation Error",
          icon: "error",
          text: "Unsuccessful Product Creation.",
        })
      }
    } catch (error) {
      console.error("Error parsing response:", error)
      Swal.fire({
        title: "Product Creation Error",
        icon: "error",
        text: "An error occurred while creating the product.",
      })
    }
  }

  return user.isAdmin === true && user.id !== null ? (
    <>
      <h1 className="my-5 text-center">Add Product</h1>
      <Form onSubmit={addProduct}>
        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter URL"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            min={0}
            placeholder="Enter Price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-5">
          Submit
        </Button>
      </Form>
    </>
  ) : (
    <Navigate to="/products" />
  )
}
