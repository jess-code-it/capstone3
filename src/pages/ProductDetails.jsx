import { useContext, useEffect, useState } from "react"
import { Button, Card, Col, Container, Modal, Row, Form } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import UserContext from "../context/UserContext"

export default function ProductDetails() {
  const { productId } = useParams()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product)
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Product not found.",
          })
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error)
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Failed to load product details.",
        })
      })
  }, [productId])

  const handleAddToCart = () => {
    if (user && user.id) {
      setShowModal(true)
    } else {
      navigate("/login")
    }
  }

  const handleAddToCartConfirm = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product._id,
          quantity: quantity,
        }),
      })

      const data = await response.json()

      if (response.status === 201) {
        Swal.fire({
          title: "Added to Cart",
          icon: "success",
          text: "Product added to cart successfully.",
        })
        setShowModal(false)
      } else {
        Swal.fire({
          title: "Add to Cart Error",
          icon: "error",
          text: data.message || "Failed to add product to cart.",
        })
      }
    } catch (error) {
      console.error("Error adding product to cart:", error)
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while adding the product to cart.",
      })
    }
  }

  return (
    <Container className="mt-3 mb-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Button
            button
            onClick={() => navigate(-1)}
            variant="outline-secondary mb-3 "
            size="sm"
          >
            Back
          </Button>{" "}
          {product ? (
            <Card>
              <Card.Header className="text-center" as="h5">
                {product.name}
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <Card.Img
                    alt="image"
                    src={product.url}
                    height="500px"
                    style={{ width: "auto", borderRadius: 0 }}
                  />
                </div>
                <Card.Text className="mt-3">{product.description}</Card.Text>
                <Card.Text
                  className="mt-3 text-danger"
                  style={{ fontWeight: "bold" }}
                >
                  ₱{product.price}
                </Card.Text>
                {user && user.id ? (
                  <Button variant="primary" block="true" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                ) : (
                  <Link className="btn btn-danger btn-block" to="/login">
                    Log in to Buy
                  </Link>
                )}
              </Card.Body>
            </Card>
          ) : (
            <p>Loading product details...</p>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddToCartConfirm}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
