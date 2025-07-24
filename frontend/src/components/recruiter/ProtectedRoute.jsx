import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      toast.warning("You're not allowed to access this route.")
      navigate("/")
    }
  }, [])

  return <>{children}</>
}

export default ProtectedRoute
