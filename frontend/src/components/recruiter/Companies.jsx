import { useNavigate } from "react-router-dom"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import CompaniesTable from "./CompaniesTable"
import useGetAllCompanies from "@/hooks/useGetAllCompanies"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setSearchCompanyText } from "@/redux/companySlice"

const Companies = () => {
  useGetAllCompanies()
  const [input, setInput] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchCompanyText(input))
  }, [input])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-14 text-darkBlue">
        <div className="flex items-center justify-between my-6">
          <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange={e => setInput(e.target.value)}
          />
          <Button
            onClick={() => navigate("/register-company")}
            className="bg-skyBlue hover:bg-hover-skyBlue text-aliceBlue"
          >
            New Company
          </Button>
        </div>

        <CompaniesTable />
      </div>
    </div>
  )
}

export default Companies
