// components/ProductCard.jsx
import PropTypes from "prop-types"
import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  if (!product) return null

  const { _id, url, name, price } = product

  return (
    <Card className="w-100 h-100 mb-4">
      <Card.Body className="d-flex flex-column align-items-center">
        <img
          alt={`${name} image`}
          src={url}
          width="160px"
          height="220px"
          className="text-center"
        />
        <Card.Title className="mb-auto mt-2">{name}</Card.Title>
        <Card.Text className="text-danger">₱{price}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">
        <Link
          className="btn btn-primary w-100 prod-card"
          to={`/products/${_id}`}
        >
          Details
        </Link>
      </Card.Footer>
    </Card>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
}
