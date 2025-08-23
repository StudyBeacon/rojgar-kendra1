import { Bookmark } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { Button } from "./ui/button"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import JobApplicationForm from "./JobApplicationForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

const Job = ({ job }) => {
  const navigate = useNavigate()
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const calcDaysPassed = mongoDate => {
    const createdAt = new Date(mongoDate)
    const currentTime = new Date()

    const timeDifference = currentTime - createdAt
    return Math.floor(timeDifference / (24 * 60 * 60 * 1000))
  }

  const handleApplyClick = () => {
    setShowApplicationForm(true)
  }

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false)
    // Optionally refresh the job list or show success message
  }

  return (
    <>
      <div className="p-5 rounded-md shadow-xl bg-white border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {calcDaysPassed(job?.createdAt) === 0
              ? "Today"
              : `${calcDaysPassed(job?.createdAt)} days ago`}
          </p>
          <Button variant="outline" className="rounded-full" size="icon">
            <Bookmark />
          </Button>
        </div>

        <div className="flex items-center gap-2 my-2">
          <Button size="icon" variant="outline" className="p-6">
            <Avatar>
              <AvatarImage
                src={
                  job?.company?.logo ||
                  "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image-300x300.png"
                }
              />
            </Avatar>
          </Button>

          <div>
            <h1 className="font-medium text-lg">{job?.company?.companyName}</h1>
            <p className="text-sm text-gray-500">{job?.location}</p>
          </div>
        </div>

        <div>
          <h1 className="font-bold text-lg my-2">{job?.title}</h1>
          <p className="text-sm text-gray-600">{job?.description}</p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Badge className="bg-skyBlue text-aliceBlue" variant="ghost">
            {`${job?.positions} Positions`}
          </Badge>
          <Badge className="bg-aliceBlue text-darkBlue" variant="ghost">
            {job?.jobType}
          </Badge>
          <Badge className="bg-orangeAccent text-darkBlue" variant="ghost">
            {`${job?.salary}LPA`}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/description/${job._id}`)}
          >
            Details
          </Button>
          <div className="flex gap-2">
            <Button className="bg-aliceBlue text-skyBlue hover:bg-hover-aliceBlue">
              Save For Later
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleApplyClick}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Application Form Dialog */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {job?.title}</DialogTitle>
          </DialogHeader>
          <JobApplicationForm
            jobId={job._id}
            jobTitle={job?.title}
            onSuccess={handleApplicationSuccess}
            onCancel={() => setShowApplicationForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Job
