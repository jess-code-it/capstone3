// src/components/CheckoutModal.js

import React from "react";
import { Modal, Button } from "react-bootstrap";

const CheckoutModal = ({ showCheckoutModal, setShowCheckoutModal, handleCheckout }) => {
  return (
    <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to proceed with the checkout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleCheckout}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;
