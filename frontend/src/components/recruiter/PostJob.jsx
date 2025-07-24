import { useState } from "react"
import Navbar from "../shared/Navbar"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Loader } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const PostJob = () => {
  const navigate = useNavigate()
  const { companies } = useSelector(state => state.company)

  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    positions: "",
    experienceLevel: "",
    company: "",
  })

  const changeInputHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleCompanyChange = value => {
    setInput({ ...input, ["company"]: value })
  }

  const formSubmitHandler = async e => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/post`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )

      if (response.status === 201) {
        toast.success(response.data.message)
        navigate("/my-jobs")
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen mt-12">
        <form
          onSubmit={formSubmitHandler}
          className="max-w-4xl p-6 bg-aliceBlue text-darkBlue rounded-xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                className="focus-visible:ring-offset-0 my-1"
                value={input.title}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                className="focus-visible:ring-offset-0 my-1"
                value={input.description}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                className="focus-visible:ring-offset-0 my-1"
                value={input.requirements}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                className="focus-visible:ring-offset-0 my-1"
                value={input.salary}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                className="focus-visible:ring-offset-0 my-1"
                value={input.location}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                className="focus-visible:ring-offset-0 my-1"
                value={input.jobType}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Number of Positions</Label>
              <Input
                type="number"
                name="positions"
                className="focus-visible:ring-offset-0 my-1"
                value={input.positions}
                onChange={changeInputHandler}
              />
            </div>

            <div>
              <Label>Preferred Experience</Label>
              <Input
                type="text"
                name="experienceLevel"
                className="focus-visible:ring-offset-0 my-1"
                value={input.experienceLevel}
                onChange={changeInputHandler}
              />
            </div>

            {companies.length > 0 && (
              <Select onValueChange={handleCompanyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {companies.map(company => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {loading ? (
            <Button disabled className="w-full mt-6">
              <Loader className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-6 bg-darkBlue">
              Post
            </Button>
          )}

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default PostJob
