/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom"
import { Badge } from "./ui/badge"

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate()

  return (
    <div
      className="p-5 rounded-md shadow-xl border border-gray-200 cursor-pointer"
      onClick={() => navigate(`/description/${job._id}`)}
    >
      <div>
        <h1 className="font-medium text-lg">{job?.company?.companyName}</h1>
        <p className="text-sm text-gray-500">{job?.location}</p>
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
    </div>
  )
}

export default LatestJobCards
