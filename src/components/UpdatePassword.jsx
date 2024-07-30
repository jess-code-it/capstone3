import React, { useState } from "react"

const UpdatePassword = () => {
  const [newPassword, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [isUpdated, setIsUpdated] = useState(false)

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessageType("danger")
      setMessage("Passwords do not match")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/update-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      )

      if (!response.ok) {
        const text = await response.text()
        console.error("Error response:", text)
        try {
          const errorData = JSON.parse(text)
          setMessageType("danger")
          setMessage(
            errorData.message || "An error occurred. Please try again."
          )
        } catch (e) {
          setMessageType("danger")
          setMessage("An unexpected error occurred. Please try again.")
        }
      } else {
        setMessageType("success")
        setMessage("Password updated successfully")
        setPassword("")
        setConfirmPassword("")
        setIsUpdated(true)
      }
    } catch (error) {
      setMessageType("danger")
      setMessage("An error occurred. Please try again.")
      console.error(error)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleUpdatePassword}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={newPassword}
            onChange={(e) => {
              setPassword(e.target.value)
              setMessage("")
              setMessageType("")
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setMessage("")
              setMessageType("")
            }}
            required
          />
        </div>
        {message && (
          <div className={`alert alert-${messageType}`}>{message}</div>
        )}
        {!isUpdated && (
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        )}
      </form>
    </div>
  )
}

export default UpdatePassword
