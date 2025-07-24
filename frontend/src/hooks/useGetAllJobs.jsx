import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { setAllJobs } from "@/redux/jobSlice"

const useGetAllJobs = () => {
  const dispatch = useDispatch()
  const { searchQuery } = useSelector(state => state.job)

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/job?keyword=${searchQuery}`,
          {
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          const { data } = response.data
          dispatch(setAllJobs(data.jobs))
        }
      } catch (e) {
        console.error(e)
        dispatch(setAllJobs([]))
      }
    }

    fetchAllJobs()
  }, [])
}

export default useGetAllJobs
