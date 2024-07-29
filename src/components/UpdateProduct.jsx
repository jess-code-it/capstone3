import PropTypes from "prop-types"
import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"

const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products`

export default function UpdateProduct({ product, onSuccess }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [url, setUrl] = useState("")
  const [showUpdate, setShowUpdate] = useState(false)

  const updateProduct = (e) => {
    e.preventDefault()
    fetch(`${PRODUCTS_URL}/${product._id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, description, price, url }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok")
        }
        return res.json()
      })
      .then((data) => {
        const isSuccess = data.message === "product updated successfully"
        Swal.fire({
          title: isSuccess ? "Success!" : "Error!",
          icon: isSuccess ? "success" : "error",
          text: isSuccess ? "Product Successfully updated" : "Please try again",
        })

        if (isSuccess) {
          onSuccess()
          handleCloseUpdate()
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          icon: "error",
          text: "Network error. Please try again",
        })
        console.error("There was an error updating the product:", error)
      })
  }

  const handleShowUpdate = () => {
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price)
    setUrl(product.url)
    setShowUpdate(true)
  }

  const handleCloseUpdate = () => {
    setName("")
    setDescription("")
    setPrice("")
    setUrl("")
    setShowUpdate(false)
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShowUpdate}>
        Update
      </Button>

      <Modal id="update-modal" show={showUpdate} onHide={handleCloseUpdate}>
        <Form onSubmit={updateProduct}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productUrl">
              <Form.Label>Url</Form.Label>
              <Form.Control
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdate}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

UpdateProduct.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
}
