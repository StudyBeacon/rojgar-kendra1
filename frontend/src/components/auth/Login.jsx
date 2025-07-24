import axios from "axios"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import logoImg from "../../assets/logoLightBG.png"
import { setLoading, setUser } from "@/redux/authSlice"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, user } = useSelector(state => state.auth)

  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
    role: "jobSeeker",
  })

  const changeEventHandler = e => {
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value })
  }
  const handleValueChange = value => {
    setFormInputs({ ...formInputs, ["role"]: value })
  }

  const formSubmitHandler = async e => {
    e.preventDefault()

    try {
      dispatch(setLoading(true))

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        formInputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        const { data, message } = response.data
        dispatch(setUser(data.user))
        navigate("/")
        toast.success(message)
      }
    } catch (e) {
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
          Log In
        </h1>

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
              value={formInputs.passwordConfirm}
              name="password"
              onChange={changeEventHandler}
              className="mt-1 w-full"
            />
          </Label>
        </div>

        <Label className="block mb-1">Select your role:</Label>
        <RadioGroup
          name="role"
          className="m-2 sm:m-3 flex flex-col items-start px-4 sm:px-8"
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

        {loading ? (
          <Button disabled className="w-full mt-4 mb-4">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full mt-4 mb-4 bg-darkBlue">
            Log In
          </Button>
        )}

        <div className="text-center">
          <span className="text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-skyBlue">
              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}

export default Login
