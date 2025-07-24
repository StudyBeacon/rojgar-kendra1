import { useNavigate } from "react-router-dom"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import MyJobsTable from "./MyJobsTable"
import useGetMyJobs from "@/hooks/useGetMyJobs"
import { setSearchJobText } from "@/redux/jobSlice"

const MyJobs = () => {
  useGetMyJobs()

  const [input, setInput] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchJobText(input))
  }, [input])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-14 text-darkBlue">
        <div className="flex items-center justify-between my-6">
          <Input
            className="w-fit"
            placeholder="Filter by company or job role"
            onChange={e => setInput(e.target.value)}
          />
          <Button
            onClick={() => navigate("/post-job")}
            className="bg-skyBlue hover:bg-hover-skyBlue text-aliceBlue"
          >
            Post a Job
          </Button>
        </div>

        <MyJobsTable />
      </div>
    </div>
  )
}

export default MyJobs
