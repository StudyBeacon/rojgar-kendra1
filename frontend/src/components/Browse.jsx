import { useDispatch, useSelector } from "react-redux"
import Job from "./Job"
import Navbar from "./shared/Navbar"
import useGetAllJobs from "@/hooks/useGetAllJobs"
import { useEffect } from "react"
import { setSearchQuery } from "@/redux/jobSlice"
import { motion } from "framer-motion"

const Browse = () => {
  useGetAllJobs()

  const { allJobs } = useSelector(state => state.job)
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(""))
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-aliceBlue">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12 lg:my-16">
        <h1 className="font-bold text-xl my-6 md:my-8 lg:my-10">
          Search Results: ({allJobs.length})
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: index * 0.1,
                },
              }}
              viewport={{ once: true }}
            >
              <Job job={job} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Browse
