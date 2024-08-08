import { useEffect, useState, useContext } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Swal from "sweetalert2";
import CartTable from "../components/CartTable";
import QuantityModal from "../components/QuantityModal";
import ClearCartModal from "../components/ClearCartModal";
import DeleteItemModal from "../components/DeleteItemModal";
import CheckoutModal from "../components/CheckoutModal"; 

const GET_CART_URL = `${import.meta.env.VITE_API_URL}/cart/get-cart`;
const UPDATE_CART_URL = `${import.meta.env.VITE_API_URL}/cart/update-cart-quantity`;
const DELETE_CART_URL = `${import.meta.env.VITE_API_URL}/cart`;
const CLEAR_CART_URL = `${import.meta.env.VITE_API_URL}/cart/clear-cart`;
const CHECKOUT_URL = `${import.meta.env.VITE_API_URL}/orders/checkout`; 

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [carts, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  const handleFetchCart = async () => {
    if (!user || !user.id) {
      Swal.fire({
        title: "User not logged in",
        icon: "error",
        text: "Please login.",
      });
      navigate("/login");
      return;
    }

    console.log("Fetching cart for user:", user.id);

    try {
      const response = await fetch(`${GET_CART_URL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Cart data received:", data);
        setCart(data.cart.cartItems || []);
      } else {
        console.error("Failed to fetch cart items, status:", response.status);
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCart([]);
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      const response = await fetch(UPDATE_CART_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: selectedCartItem.productId._id,
          quantity,
        }),
      });

      if (response.status === 200) {
        const updatedCart = await response.json();
        Swal.fire({
          title: "Quantity Updated",
          icon: "success",
          text: "The quantity has been successfully updated.",
          confirmButtonText: "OK",
          timer: 2000,
        });
        console.log("Cart item updated:", updatedCart);
        handleFetchCart();
        setShowModal(false);
      } else {
        console.error("Failed to update cart item, status:", response.status);
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      const response = await fetch(`${DELETE_CART_URL}/${itemIdToDelete}/remove-from-cart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Product Deleted",
          icon: "success",
          text: "The product has been successfully deleted.",
          confirmButtonText: "OK",
          timer: 2000,
        });
        handleFetchCart();
        setShowDeleteModal(false);
      } else {
        console.error("Failed to remove cart item, status:", response.status);
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch(CLEAR_CART_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Cart Cleared",
          icon: "success",
          text: "All items have been successfully removed from the cart.",
          confirmButtonText: "OK",
          timer: 2000,
        });
        handleFetchCart();
        setShowClearModal(false);
      } else {
        console.error("Failed to clear cart, status:", response.status);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(CHECKOUT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Checkout Successful",
          icon: "success",
          text: "Your order has been placed successfully.",
          confirmButtonText: "OK",
          timer: 2000,
        });
        handleFetchCart();
        setShowCheckoutModal(false);
      } else {
        console.error("Failed to checkout, status:", response.status);
        Swal.fire({
          title: "No Items in Cart",
          icon: "warning",
          text: "There are no items to checkout.",
          confirmButtonText: "OK",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const handleShowModal = (cartItem) => {
    setSelectedCartItem(cartItem);
    setQuantity(cartItem.quantity);
    setShowModal(true);
  };

  const handleShowDeleteModal = (itemId) => {
    setItemIdToDelete(itemId);
    setShowDeleteModal(true);
  };

  const handleShowCheckoutModal = () => {
    setShowCheckoutModal(true);
  };

  useEffect(() => {
    handleFetchCart();
  }, [user]);

  const calculateTotalPrice = () => {
    return carts.reduce((total, item) => total + (item.subtotal || 0), 0);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div>
      <h1 className="my-5 text-center">My Cart</h1>
      <Row className="mb-3">
        <Col className="d-flex justify-content-start">
          <Button
            onClick={() => navigate(-1)}
            variant="outline-secondary"
            size="sm"
          >
            Back
          </Button>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="danger" onClick={() => setShowClearModal(true)}>
            Clear All Products
          </Button>
        </Col>
      </Row>
      <CartTable
        carts={carts}
        handleShowModal={handleShowModal}
        handleShowDeleteModal={handleShowDeleteModal}
        totalPrice={totalPrice}
        handleCheckout={handleShowCheckoutModal}
      />
      <QuantityModal
        showModal={showModal}
        setShowModal={setShowModal}
        quantity={quantity}
        setQuantity={setQuantity}
        handleUpdateQuantity={handleUpdateQuantity}
      />
      <ClearCartModal
        showClearModal={showClearModal}
        setShowClearModal={setShowClearModal}
        handleClearCart={handleClearCart}
      />
      <DeleteItemModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteItem={handleDeleteItem}
      />
      <CheckoutModal
        showCheckoutModal={showCheckoutModal}
        setShowCheckoutModal={setShowCheckoutModal}
        handleCheckout={handleCheckout}
      />
    </div>
  );
}
