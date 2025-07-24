import { ChevronLeft, Loader } from "lucide-react"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import useGetCompanyById from "@/hooks/useGetCompanyById"

// helper function
function prepareFormData(formInputs) {
  let formData = new FormData()

  Object.keys(formInputs).forEach(el => {
    formData.append(el, formInputs[el])
  })

  return formData
}

const CompanyProfile = () => {
  const navigate = useNavigate()
  const { companyId } = useParams()

  useGetCompanyById(companyId)

  const { singleCompany } = useSelector(state => state.company)

  const [loading, setLoading] = useState(false)

  const [input, setInput] = useState({
    companyName: singleCompany?.companyName || "",
    description: singleCompany?.description || "",
    website: singleCompany?.website || "",
    location: singleCompany?.location || "",
    file: null,
  })

  const changeInputHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const changeFileHandler = e => {
    setInput({ ...input, file: e.target.files?.[0] })
  }

  const formSubmitHandler = async e => {
    e.preventDefault()

    const formData = prepareFormData(input)

    try {
      setLoading(true)

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/company/${companyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        navigate("/my-companies")
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setInput({
      companyName: singleCompany?.companyName || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      location: singleCompany?.location || "",
      file: null,
    })
  }, [singleCompany])

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-14 text-darkBlue">
        <form
          className="bg-aliceBlue p-8 rounded-xl"
          onSubmit={formSubmitHandler}
        >
          <div className="grid grid-cols-12 items-center gap-10">
            <Button
              variant="outline"
              size="icon"
              className="flex justify-center items-center text-gray-500 hover:text-darkBlue col-span-1"
              onClick={e => {
                e.preventDefault()
                navigate("/my-companies")
              }}
            >
              <ChevronLeft />
            </Button>

            <h1 className="font-bold text-2xl text-skyBlue col-span-11 text-center">
              Company Setup
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8">
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="companyName"
                value={input.companyName}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Logo</Label>
              <Input
                accept="image/*"
                type="file"
                name="file"
                className="cursor-pointer"
                onChange={changeFileHandler}
              />
            </div>
          </div>

          {loading ? (
            <Button disabled className="w-full mt-8">
              <Loader className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-8 bg-darkBlue">
              Update
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}

export default CompanyProfile
