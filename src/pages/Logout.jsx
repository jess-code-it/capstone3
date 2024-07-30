import { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import UserContext from "../context/UserContext"

export default function Logout() {
  const { setUser } = useContext(UserContext)

  useEffect(() => {
    setUser(null)
  }, [setUser])

  useEffect(() => {
    localStorage.removeItem("token")
  }, [])
  return <Navigate to="/login" />
}
