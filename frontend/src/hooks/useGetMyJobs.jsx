import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { setMyAllJobs } from "@/redux/jobSlice"

const useGetMyJobs = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchMyAllJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/my-jobs`,
          {
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          const { data } = response.data
          dispatch(setMyAllJobs(data.jobs))
        }
      } catch (e) {
        console.error(e)
        dispatch(setMyAllJobs([]))
      }
    }

    fetchMyAllJobs()
  }, [])
}

export default useGetMyJobs
