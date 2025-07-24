import axios from "axios"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import Navbar from "../shared/Navbar"
import ApplicationsTable from "./ApplicationsTable"
import { setApplicants } from "@/redux/applicationSlice"

const Applicants = () => {
  const { jobId } = useParams()
  const dispatch = useDispatch()

  const { applicants } = useSelector(state => state.application)

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/application/${jobId}/applicants`,
          {
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          const { data } = response.data
          dispatch(setApplicants(data.applications))
        }
      } catch (e) {
        console.error(e)
        dispatch(setApplicants([]))
      }
    }

    fetchAllApplicants()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-16">
        <h1 className="font-bold text-xl my-10 text-darkBlue">
          Applicants ({applicants?.length})
        </h1>
        <ApplicationsTable />
      </div>
    </div>
  )
}

export default Applicants
