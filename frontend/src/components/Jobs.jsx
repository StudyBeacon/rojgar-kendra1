import { useSelector } from "react-redux"
import FilterCard from "./FilterCard"
import Job from "./Job"
import Navbar from "./shared/Navbar"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const Jobs = () => {
  const { allJobs, searchQuery } = useSelector(state => state.job)
  const [filterJobs, setFilterJobs] = useState(allJobs)

  useEffect(() => {
    const filteredJobs = allJobs.filter(job => {
      if (!searchQuery) return true

      return (
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

    setFilterJobs(filteredJobs)
  }, [allJobs, searchQuery])

  return (
    <div className="text-darkBlue bg-aliceBlue min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 lg:pt-12 h-full">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5">
          <div className="w-full lg:w-1/5 mb-4 lg:mb-0">
            <FilterCard />
          </div>

          {filterJobs.length === 0 ? (
            <div className="flex-1 flex justify-center items-center h-40 sm:h-60 lg:h-[80vh] mx-auto">
              <span className="text-skyBlue font-medium text-lg sm:text-xl md:text-2xl">
                No Jobs Found!
              </span>
            </div>
          ) : (
            <div className="flex-1 h-full max-h-[70vh] sm:max-h-[80vh] lg:h-[90vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filterJobs.map((job, index) => (
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
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs
