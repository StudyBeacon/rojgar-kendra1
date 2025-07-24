import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Check, MoreHorizontal, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "sonner"

const ApplicationsTable = () => {
  const { applicants } = useSelector(state => state.application)

  const handleApplicationStatus = async (status, applicationId) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/application/${applicationId}/update-status`,
        { status },
        {
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
      }
    } catch (e) {
      console.error(e)
      toast.error(e.response.data.message)
    }
  }

  return (
    <div>
      <Table className="border border-gray-200 rounded-xl text-darkBlue">
        <TableCaption>A list of your job&apos;s applicants.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-aliceBlue">
          {applicants &&
            applicants.map(item => {
              return (
                <TableRow key={item._id}>
                  <TableCell>{item.applicant.fullName}</TableCell>
                  <TableCell>{item.applicant.email}</TableCell>
                  <TableCell>{item.applicant.phoneNumber}</TableCell>
                  <TableCell>
                    {item.applicant.profile.resume ? (
                      <a
                        target="_blank"
                        href={item.applicant.profile.resume}
                        className="text-skyBlue w-full hover:underline"
                      >
                        {item.applicant.profile.resumeOriginalName}
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{item.createdAt.split("T")[0]}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>

                      <PopoverContent className="w-fit">
                        <div>
                          <div
                            onClick={() =>
                              handleApplicationStatus("accepted", item._id)
                            }
                            className="flex items-center my-2 gap-1 cursor-pointer"
                          >
                            <Check size={20} className="text-green-500" />
                            <span>Accept</span>
                          </div>

                          <div
                            onClick={() =>
                              handleApplicationStatus("rejected", item._id)
                            }
                            className="flex items-center my-2 gap-1 cursor-pointer"
                          >
                            <X size={20} className="text-red-500" />
                            <span>Reject</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}

export default ApplicationsTable
