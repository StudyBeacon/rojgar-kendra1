import Navbar from "./shared/Navbar"
import HeroSection from "./HeroSection"
import CategoryCarousel from "./CategoryCarousel"
import LatestJobs from "./LatestJobs"
import Footer from "./Footer"
import useGetAllJobs from "@/hooks/useGetAllJobs"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Home = () => {
  useGetAllJobs()

  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/my-companies")
    }
  }, [])

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home
