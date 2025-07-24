import { useSelector } from "react-redux"
import LatestJobCards from "./LatestJobCards"
import { motion } from "framer-motion"

const LatestJobs = () => {
  const { allJobs } = useSelector(state => state.job)

  return (
    <div className="max-w-7xl mx-auto px-4 my-8 sm:my-12 md:my-16 lg:my-20 text-darkBlue">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left">
        <span className="text-skyBlue">Latest & Top </span>Job Openings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 my-4 sm:my-5">
        {allJobs.length === 0 ? (
          <span className="col-span-1 sm:col-span-2 lg:col-span-3 text-center my-6 sm:my-8 lg:my-10 text-skyBlue font-medium text-xl sm:text-2xl">
            No Jobs Found!
          </span>
        ) : (
          allJobs?.slice(0, 6).map((job, index) => (
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
              <LatestJobCards job={job} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default LatestJobs
