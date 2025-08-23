import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Navbar from "../shared/Navbar"
import EnhancedApplicantsTable from "./EnhancedApplicantsTable"

const Applicants = () => {
  const { jobId } = useParams()
  const [jobTitle, setJobTitle] = useState("")

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/${jobId}`,
          {
            withCredentials: true
          }
        )

        if (response.status === 200) {
          setJobTitle(response.data.data.job.title)
        }
      } catch (error) {
        console.error('Error fetching job details:', error)
        setJobTitle("Job")
      }
    }

    fetchJobDetails()
  }, [jobId])

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-16 px-4">
        <EnhancedApplicantsTable jobId={jobId} jobTitle={jobTitle} />
      </div>
    </div>
  )
}

export default Applicants
