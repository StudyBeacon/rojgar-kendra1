import { Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setSearchQuery } from "@/redux/jobSlice"
import { useNavigate } from "react-router-dom"

const HeroSection = () => {
  const [query, setQuery] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleJobSearch = () => {
    dispatch(setSearchQuery(query))
    navigate("/browse")
  }

  return (
    <div className="w-full pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-10 sm:pb-14 lg:pb-20 bg-aliceBlue text-center text-darkBlue">
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 max-w-4xl mx-auto">
        <span className="font-medium text-sm sm:text-base lg:text-lg bg-orangeAccent mx-auto rounded-full px-3 sm:px-4 py-1">
          Nepal&apos;s No. 1 <span className="text-skyBlue">Job Portal</span>
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold px-2">
          Search, Apply & <br className="hidden sm:block" /> Get Your
          <span className="text-skyBlue"> Dream Job</span>
        </h1>

        <p className="text-sm sm:text-base max-w-xl mx-auto px-2">
          Find your dream job with ease! Explore opportunities, connect with
          employers, and apply effortlessly today.
        </p>

        <div className="flex w-full sm:w-4/5 md:w-3/5 lg:w-2/5 shadow-lg items-center mx-auto mt-2 sm:mt-4">
          <Input
            type="text"
            placeholder="Find your job..."
            value={query}
            className="w-full"
            onChange={e => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-darkBlue"
            onClick={handleJobSearch}
          >
            <Search />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
