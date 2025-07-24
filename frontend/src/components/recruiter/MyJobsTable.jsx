import { Edit2, Eye, MoreHorizontal } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const MyJobsTable = () => {
  const navigate = useNavigate()

  const { myAllJobs, searchJobText } = useSelector(state => state.job)
  const [filterJobs, setFilterJobs] = useState(myAllJobs)

  useEffect(() => {
    const filteredJobs =
      myAllJobs.length >= 0 &&
      myAllJobs.filter(job => {
        if (!searchJobText) return true

        return (
          job?.title?.toLowerCase().includes(searchJobText.toLowerCase()) ||
          job?.company?.companyName
            ?.toLowerCase()
            .includes(searchJobText.toLowerCase())
        )
      })

    setFilterJobs(filteredJobs)
  }, [myAllJobs, searchJobText])

  return (
    <div>
      <Table className="border border-gray-200 rounded-xl text-darkBlue">
        <TableCaption>
          {filterJobs?.length === 0
            ? "Get started by posting your job openings."
            : "A list of your recent posted jobs."}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-aliceBlue">
          {filterJobs?.length !== 0 && (
            <>
              {filterJobs?.map(job => {
                return (
                  <TableRow key={job?._id}>
                    <TableCell>{job.company.companyName}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.createdAt.split("T")[0]}</TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger>
                          <MoreHorizontal />
                        </PopoverTrigger>
                        <PopoverContent className="w-fit text-darkBlue">
                          <div
                            onClick={() =>
                              navigate(`/my-jobs/${job._id}/applicants`)
                            }
                            className="flex items-center gap-2 w-fit cursor-pointer"
                          >
                            <Eye className="w-4" />
                            <span>Applicants</span>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                )
              })}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default MyJobsTable
