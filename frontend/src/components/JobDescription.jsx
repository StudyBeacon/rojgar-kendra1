import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { setSingleJob } from "@/redux/jobSlice"
import Navbar from "./shared/Navbar"

const JobDescription = () => {
  const { jobId } = useParams()

  const dispatch = useDispatch()
  const { singleJob } = useSelector(state => state.job)
  const { user } = useSelector(state => state.auth)

  const isInitiallyApplied = singleJob?.applications?.some(
    application => application?.applicant === user?._id
  )
  const [isApplied, setIsApplied] = useState(isInitiallyApplied)

  const applyJobHandler = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/apply/${jobId}`,
        {
          withCredentials: true,
        }
      )

      if (response.status === 201) {
        setIsApplied(true)

        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        }
        dispatch(setSingleJob(updatedSingleJob))

        toast.success(response.data.message)
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    }
  }

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/${jobId}`,
          {
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          const { data } = response.data
          dispatch(setSingleJob(data.job))

          setIsApplied(
            data.job.applications?.some(
              application => application?.applicant === user?._id
            )
          )
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchSingleJob()
  }, [jobId, dispatch, user?._id])

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 my-4 sm:my-6 md:my-8 lg:my-10">
        <div className="bg-aliceBlue p-4 sm:p-6 md:p-8 rounded-lg text-darkBlue shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-bold text-lg sm:text-xl">
                {singleJob?.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-4">
                <Badge
                  className="bg-skyBlue text-aliceBlue text-xs sm:text-sm"
                  variant="ghost"
                >
                  {`${singleJob?.positions} Positions`}
                </Badge>
                <Badge
                  className="bg-aliceBlue border-gray-400 text-darkBlue text-xs sm:text-sm"
                  variant="ghost"
                >
                  {singleJob?.jobType}
                </Badge>
                <Badge
                  className="bg-orangeAccent text-darkBlue text-xs sm:text-sm"
                  variant="ghost"
                >
                  {`${singleJob?.salary}LPA`}
                </Badge>
              </div>
            </div>

            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`w-full sm:w-auto rounded-lg ${
                isApplied
                  ? ""
                  : "bg-skyBlue text-aliceBlue hover:bg-hover-skyBlue"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>

          <h1 className="border-b-2 border-b-gray-300 font-medium py-3 sm:py-4 mt-4 sm:mt-6">
            Job Description
          </h1>

          <div className="my-3 sm:my-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <h1 className="font-bold my-1">
                Role:
                <span className="pl-2 font-normal text-gray-800">
                  {singleJob?.title}
                </span>
              </h1>

              <h1 className="font-bold my-1">
                Location:
                <span className="pl-2 font-normal text-gray-800">
                  {singleJob?.location}
                </span>
              </h1>

              <h1 className="font-bold my-1">
                Experience:
                <span className="pl-2 font-normal text-gray-800">
                  {singleJob?.experienceLevel} yrs
                </span>
              </h1>

              <h1 className="font-bold my-1">
                Salary:
                <span className="pl-2 font-normal text-gray-800">
                  {singleJob?.salary}LPA
                </span>
              </h1>

              <h1 className="font-bold my-1">
                Total Applicants:
                <span className="pl-2 font-normal text-gray-800">
                  {singleJob?.applications?.length}
                </span>
              </h1>

              <h1 className="font-bold my-1">
                Posted Date:
                <span className="pl-2 font-normal text-gray-800">
                  {singleJob?.createdAt?.split("T")[0]}
                </span>
              </h1>
            </div>

            <h1 className="font-bold my-3 sm:my-4">
              Description:
              <span className="pl-2 font-normal text-gray-800 block mt-1">
                {singleJob?.description}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default JobDescription
