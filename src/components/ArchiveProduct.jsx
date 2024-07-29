import PropTypes from "prop-types"
import { Button } from "react-bootstrap"
import Swal from "sweetalert2"

const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products`

export default function ArchiveProduct({ id, isActive, onSuccess }) {
  const handleToggle = () => {
    fetch(`${PRODUCTS_URL}/${id}/${isActive ? "archive" : "activate"}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const isSuccess =
          data.message ===
          `Product ${isActive ? "archived" : "activated"} successfully`
        Swal.fire({
          title: isSuccess ? "Success" : "Something Went Wrong",
          icon: isSuccess ? "success" : "error",
          text: isSuccess
            ? `Product successfully ${isActive ? "disabled" : "enabled"}`
            : "Please Try again",
        })

        if (isSuccess) {
          onSuccess()
        }
      })
  }

  return (
    <>
      <Button
        variant={isActive ? "danger" : "success"}
        size="sm"
        onClick={() => handleToggle()}
      >
        {isActive ? "Archive" : "Activate"}
      </Button>
    </>
  )
}

ArchiveProduct.propTypes = {
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onSuccess: PropTypes.func,
}
