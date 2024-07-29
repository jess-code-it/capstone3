import { Table, Button } from "react-bootstrap";
import CartItem from "./CartItem";

const CartTable = ({ carts, handleShowModal, handleShowDeleteModal, totalPrice, handleCheckout }) => {
  const truncateDescription = (description, maxLength) => {
    if (!description) return "N/A";
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description;
  };

  return (
    <Table striped bordered hover responsive variant="white">
      <thead>
        <tr className="text-center">
          <th></th>
          <th colSpan="2">Name</th>
          <th>Description</th>
          <th className="col-1">Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th colSpan="2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(carts) &&
          carts.map((cart, index) => (
            <CartItem
              key={cart._id || index}
              cart={cart}
              index={index}
              handleShowModal={handleShowModal}
              handleShowDeleteModal={handleShowDeleteModal}
              truncateDescription={truncateDescription}
            />
          ))}
        <tr>
          <td colSpan="6" className="text-end">
            <h4>Total Price:</h4>
          </td>
          <td className="text-center">
            <h3>&#x20B1;{totalPrice}</h3>
          </td>
          <td colSpan="2">
            <Button className="col-12 text-center" variant="success" onClick={handleCheckout}>
              Checkout
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default CartTable;
