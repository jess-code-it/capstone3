// pages/ProductCatalog.jsx
import { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import UserContext from "../context/UserContext";

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const fetchUrl =
        user && user.isAdmin
          ? `${import.meta.env.VITE_API_URL}/products/all`
          : `${import.meta.env.VITE_API_URL}/products/active`;

      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      if (data.message === "No products found") {
        setProducts([]);
      } else {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("fetchData finished");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div>
      <h1 className="text-center my-4">Our Products</h1>
      <Stack direction="horizontal" gap={4}>
        <Container fluid>
          <Row
            style={{
              display: "grid",
              gridAutoRows: "1fr",
              gridTemplateColumns: "repeat(5, 1fr)",
              rowGap: "24px",
            }}
          >
            {products.map((product) => (
              <Col className="text-center" key={product._id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </Stack>
    </div>
  );
}
