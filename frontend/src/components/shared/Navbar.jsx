import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { AlignJustify, LogOut, UserRound } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { setUser } from "@/redux/authSlice"

import { Button } from "../ui/button"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import logoImg from "../../assets/logoDarkBG.png"

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const handleLogOut = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        dispatch(setUser(null))
        navigate("/")
        toast.success(response.data.message)
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    }
  }

  return (
    <div className="bg-darkBlue">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        <div>
          <img src={logoImg} alt="logo" width={120} />
        </div>

        {/* Mobile hamburger menu */}
        <div className="block lg:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="text-aliceBlue hover:text-hover-aliceBlue hover:bg-darkBlue"
              >
                <AlignJustify />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 mr-4 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col space-y-2">
                  {user && user.role === "recruiter" ? (
                    <>
                      <Link
                        to="/my-companies"
                        className="text-sm font-medium hover:text-skyBlue"
                      >
                        Companies
                      </Link>
                      <Link
                        to="/my-jobs"
                        className="text-sm font-medium hover:text-skyBlue"
                      >
                        Jobs
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/"
                        className="text-sm font-medium hover:text-skyBlue"
                      >
                        Home
                      </Link>
                      <Link
                        to="/jobs"
                        className="text-sm font-medium hover:text-skyBlue"
                      >
                        Jobs
                      </Link>
                      <Link
                        to="/browse"
                        className="text-sm font-medium hover:text-skyBlue"
                      >
                        Browse
                      </Link>
                    </>
                  )}
                </div>

                {!user ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t">
                    <Link to="/login">
                      <Button variant="ghost" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="secondary" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="pt-2 border-t">
                    <div className="flex gap-3 mb-4">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={
                            user?.profile?.profilePhoto ||
                            `https://wallpapers.com/images/high/placeholder-profile-icon-20tehfawxt5eihco.png`
                          }
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-skyBlue text-sm">
                          {user?.fullName}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {user?.profile?.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {user && user.role === "jobSeeker" && (
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 text-sm hover:text-skyBlue"
                        >
                          <UserRound size={16} />
                          View Profile
                        </Link>
                      )}
                      <button
                        onClick={handleLogOut}
                        className="flex items-center gap-2 text-sm hover:text-skyBlue"
                      >
                        <LogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Desktop navbar */}
        <div className="hidden lg:flex font-medium items-center gap-12">
          <ul className="flex text-sm items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <Button variant="link" className="text-aliceBlue">
                  <Link to="/my-companies">Companies</Link>
                </Button>
                <Button variant="link" className="text-aliceBlue">
                  <Link to="/my-jobs">Jobs</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="link" className="text-aliceBlue">
                  <Link to="/">Home</Link>
                </Button>
                <Button variant="link" className="text-aliceBlue">
                  <Link to="/jobs">Jobs</Link>
                </Button>
                <Button variant="link" className="text-aliceBlue">
                  <Link to="/browse">Browse</Link>
                </Button>
              </>
            )}
          </ul>

          {!user ? (
            <div>
              <Link to="/login">
                <Button className="text-aliceBlue bg-inherit hover:bg-inherit hover:text-muted-foreground">
                  Log In
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      `https://wallpapers.com/images/high/placeholder-profile-icon-20tehfawxt5eihco.png`
                    }
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent>
                <div className="flex gap-4 space-y-2 w-fit">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        `https://wallpapers.com/images/high/placeholder-profile-icon-20tehfawxt5eihco.png`
                      }
                    />
                  </Avatar>

                  <div>
                    <h4 className="font-medium text-skyBlue">
                      {user?.fullName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mt-5 ml-4">
                  {user && user.role === "jobSeeker" && (
                    <div className="flex items-center w-fit cursor-pointer">
                      <UserRound />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center w-fit cursor-pointer">
                    <LogOut />
                    <Button variant="link" onClick={handleLogOut}>
                      Log Out
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
