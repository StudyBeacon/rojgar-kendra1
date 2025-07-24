import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setAppliedJobs } from "@/redux/jobSlice"

const useGetAppliedJobs = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/applied-jobs`,
          {
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          const { data } = response.data
          console.log(response.data)

          dispatch(setAppliedJobs(data.applications))
        }
      } catch (e) {
        console.error(e)
        dispatch(setAppliedJobs([]))
      }
    }

    fetchAppliedJobs()
  }, [])
}

export default useGetAppliedJobs
