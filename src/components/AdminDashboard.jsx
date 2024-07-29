import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import ArchiveProduct from "../components/ArchiveProduct"
import UpdateProduct from "../components/UpdateProduct"

const ALL_PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products/all`
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  const handleFetchData = async () => {
    try {
      const response = await fetch(ALL_PRODUCTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        console.error("Failed to fetch products")
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleFetchData()
  }, [])

  return (
    <div>
      <h1 className="text-center my-4">Admin Dashboard</h1>
      <div className="d-flex justify-content-center gap-1 mb-4">
        <Button variant="primary" onClick={() => navigate("/addProduct")}>
          Create New Product
        </Button>
        <Link className="btn btn-success btn-block" to="/all-orders">
          Show All Users Orders
        </Link>
      </div>
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Book Cover</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>
                <img
                  alt="image"
                  src={product.url}
                  width="150px"
                  height="200px"
                  className="text-center "
                />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td className={product.isActive ? "text-success" : "text-danger"}>
                {product.isActive ? "Available" : "Unavailable"}
              </td>
              <td>
                <div className="d-flex justify-content-between">
                  <UpdateProduct
                    product={product}
                    onSuccess={handleFetchData}
                  />
                  <ArchiveProduct
                    id={product._id}
                    isActive={product.isActive}
                    onSuccess={handleFetchData}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
