import axios from "axios"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setUser } from "@/redux/authSlice"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

import logoImg from "../../assets/logoLightBG.png"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, user } = useSelector(state => state.auth)

  const [formInputs, setFormInputs] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    role: "jobSeeker",
    file: "",
  })

  const changeEventHandler = e => {
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value })
  }
  const handleValueChange = value => {
    setFormInputs({ ...formInputs, ["role"]: value })
  }

  const changeFileHandler = e => {
    setFormInputs({ ...formInputs, file: e.target.files?.[0] })
  }

  const formSubmitHandler = async e => {
    e.preventDefault()

    const formData = prepareFormData(formInputs)

    try {
      dispatch(setLoading(true))

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )

      if (response.status === 201) {
        const { data, message } = response.data
        dispatch(setUser(data.user))
        navigate("/")
        toast.success(message)
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (user) {
      toast.warning("You're already logged in!")
      navigate("/")
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row items-center justify-center md:justify-around min-h-screen w-full text-darkBlue bg-aliceBlue p-4">
      <div className="w-full md:w-1/3 flex justify-center items-center mb-8 md:mb-0">
        <Link to="/">
          <img
            src={logoImg}
            alt="logo-image"
            className="max-w-full h-auto w-40 md:w-auto"
          />
        </Link>
      </div>

      <form
        onSubmit={formSubmitHandler}
        className="w-full max-w-md md:w-1/3 border border-gray-200 rounded-md p-4 sm:p-6 shadow-lg bg-primary-foreground"
      >
        <h1 className="font-bold text-2xl sm:text-3xl mb-5 sm:mb-7 text-center">
          Register
        </h1>

        <div className="my-3">
          <Label className="block mb-1">
            Full Name
            <Input
              type="text"
              value={formInputs.fullName}
              name="fullName"
              onChange={changeEventHandler}
              placeholder="John Doe"
              className="mt-1 w-full"
            />
          </Label>
        </div>

        <div className="my-3">
          <Label className="block mb-1">
            Email Address
            <Input
              type="email"
              value={formInputs.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@email.com"
              className="mt-1 w-full"
            />
          </Label>
        </div>

        <div className="my-3">
          <Label className="block mb-1">
            Password
            <Input
              type="password"
              value={formInputs.password}
              name="password"
              onChange={changeEventHandler}
              className="mt-1 w-full"
            />
          </Label>
        </div>

        <div className="my-3">
          <Label className="block mb-1">
            Confirm Password
            <Input
              type="password"
              value={formInputs.passwordConfirm}
              name="passwordConfirm"
              onChange={changeEventHandler}
              className="mt-1 w-full"
            />
          </Label>
        </div>

        <div className="my-3">
          <Label className="block mb-1">
            Phone Number
            <Input
              type="number"
              value={formInputs.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="9876543210"
              className="mt-1 w-full"
            />
          </Label>
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-between my-3 gap-4">
          <div className="w-full sm:w-1/2">
            <Label className="block mb-1">Select your role:</Label>
            <RadioGroup
              name="role"
              className="mt-2 sm:m-3 flex flex-col items-start px-2 sm:px-8"
              value={formInputs.role}
              onValueChange={handleValueChange}
            >
              <div className="flex items-center space-x-2 my-1">
                <RadioGroupItem value="jobSeeker" id="jobSeeker" />
                <Label htmlFor="jobSeeker" className="cursor-pointer">
                  Job Seeker
                </Label>
              </div>
              <div className="flex items-center space-x-2 my-1">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter" className="cursor-pointer">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="w-full sm:w-1/2 mt-3 sm:mt-0">
            <Label htmlFor="picture" className="block mb-1">
              Profile Picture
            </Label>
            <Input
              accept="image/*"
              id="picture"
              type="file"
              className="cursor-pointer w-full text-sm"
              name="file"
              onChange={changeFileHandler}
            />
          </div>
        </div>

        {loading ? (
          <Button disabled className="w-full mt-4 mb-4">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full mt-4 mb-4 bg-darkBlue">
            Register
          </Button>
        )}

        <div className="text-center">
          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-skyBlue">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}

// helper function
function prepareFormData(formInputs) {
  let formData = new FormData()

  Object.keys(formInputs).forEach(el => {
    formData.append(el, formInputs[el])
  })

  return formData
}

export default Register
