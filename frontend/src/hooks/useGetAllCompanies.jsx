import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { setCompanies } from "@/redux/companySlice"

const useGetAllCompanies = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/company/my-companies`,
          {
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          const { data } = response.data
          dispatch(setCompanies(data.companies))
        }
      } catch (e) {
        console.error(e)
        dispatch(setCompanies([]))
      }
    }

    fetchAllCompanies()
  }, [])
}

export default useGetAllCompanies
