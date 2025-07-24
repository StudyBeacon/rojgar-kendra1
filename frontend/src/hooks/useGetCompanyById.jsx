import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { setSingleCompany } from "@/redux/companySlice"

const useGetCompanyById = companyId => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/company/${companyId}`,
          {
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          const { data } = response.data
          dispatch(setSingleCompany(data.company))
        }
      } catch (e) {
        console.error(e)
        dispatch(setSingleCompany(null))
      }
    }

    fetchSingleCompany()
  }, [companyId, dispatch])
}

export default useGetCompanyById
