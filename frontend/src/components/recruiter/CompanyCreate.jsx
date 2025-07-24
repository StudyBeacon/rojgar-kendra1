import { useNavigate } from "react-router-dom"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setSingleCompany } from "@/redux/companySlice"

const CompanyCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState()

  const registerNewCompany = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/company/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        const { message, data } = response.data
        dispatch(setSingleCompany(data.company))
        navigate(`/my-companies/${data.company._id}`)
        toast.success(message)
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto my-14 text-darkBlue bg-aliceBlue py-5 px-8 rounded-xl">
        <div className="my-10">
          <h1 className="font-bold text-3xl text-skyBlue">
            Register Your Company
          </h1>
          <p className="text-gray-500">
            Create a profile for your company. You can always change this later.
          </p>
        </div>

        <Label>Company Name</Label>
        <Input
          type="text"
          className="my-1"
          placeholder="Google, Microsoft, Amazon..."
          onChange={e => setCompanyName(e.target.value)}
        />

        <div className="flex items-center gap-2 my-10">
          <Button
            className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
            onClick={() => navigate("/my-companies")}
          >
            Cancel
          </Button>
          <Button className="bg-darkBlue" onClick={registerNewCompany}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompanyCreate
