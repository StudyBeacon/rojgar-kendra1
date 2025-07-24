import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"
import { useSelector } from "react-redux"

const AppliedJobsTable = () => {
  const { appliedJobs } = useSelector(state => state.job)

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[600px] border border-gray-200 rounded-xl text-darkBlue">
        <TableCaption>
          {appliedJobs.length > 0
            ? "A list of your applied jobs."
            : "You've not applied to any jobs yet."}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="hidden lg:table-cell whitespace-nowrap px-4 py-2">
              Date
            </TableHead>
            <TableHead className="whitespace-nowrap px-4 py-2">
              Job Role
            </TableHead>
            <TableHead className="hidden md:table-cell whitespace-nowrap px-4 py-2">
              Company
            </TableHead>
            <TableHead className="text-center whitespace-nowrap px-4 py-2">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-aliceBlue">
          {appliedJobs.length > 0 &&
            appliedJobs.map(appliedJob => (
              <TableRow key={appliedJob._id}>
                <TableCell className="hidden lg:table-cell whitespace-nowrap px-4 py-2">
                  {appliedJob.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="whitespace-nowrap px-4 py-2">
                  {appliedJob.job.title}
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap px-4 py-2">
                  {appliedJob.job.company.companyName}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap px-4 py-2">
                  <Badge
                    className={`${
                      appliedJob.status === "pending"
                        ? "bg-gray-500"
                        : appliedJob.status === "accepted"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } hover:bg-skyBlue px-2 py-1 rounded text-white text-xs`}
                  >
                    {appliedJob.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobsTable
