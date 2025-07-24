import { useState } from "react"
import { useSelector } from "react-redux"
import { Mail, Phone, UserRoundPen } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import Navbar from "./shared/Navbar"
import { Button } from "./ui/button"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Label } from "./ui/label"
import AppliedJobsTable from "./AppliedJobsTable"
import UpdateProfileDialog from "./UpdateProfileDialog"
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs"

const Profile = () => {
  useGetAppliedJobs()

  const [open, setOpen] = useState(false)
  const { user } = useSelector(state => state.auth)

  return (
    <div className="pb-8 sm:pb-10 md:pb-14">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 mt-6 sm:mt-10 md:mt-14">
        <div className="bg-aliceBlue text-darkBlue border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl my-3 sm:my-4 md:my-5 p-4 sm:p-6 md:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <Avatar className="cursor-pointer size-16 sm:size-20 md:size-24">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    `https://wallpapers.com/images/high/placeholder-profile-icon-20tehfawxt5eihco.png`
                  }
                />
              </Avatar>

              <div className="text-center sm:text-left">
                <h1 className="font-medium text-lg sm:text-xl text-skyBlue">
                  {user?.fullName}
                </h1>
                <p className="text-sm sm:text-base mt-1">
                  {user?.profile?.bio}
                </p>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="self-center sm:self-start mt-2 sm:mt-0"
                    onClick={() => setOpen(true)}
                  >
                    <UserRoundPen className="size-4 sm:size-5" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Edit Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="my-4 sm:my-5">
            <div className="flex items-center gap-2 sm:gap-3 my-2">
              <Mail className="text-darkBlue size-4 sm:size-5" />
              <span className="text-sm sm:text-base overflow-hidden text-ellipsis">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 my-2">
              <Phone className="text-darkBlue size-4 sm:size-5" />
              <span className="text-sm sm:text-base">{user?.phoneNumber}</span>
            </div>
          </div>

          <div className="my-4 sm:my-5">
            <h1 className="font-bold text-sm sm:text-base">Skills</h1>

            <div className="flex flex-wrap items-center gap-1 mt-2">
              {user?.profile?.skills?.length !== 0 ? (
                user?.profile?.skills?.map((item, index) => (
                  <Badge
                    key={index}
                    className="bg-skyBlue text-aliceBlue hover:bg-hover-skyBlue text-xs sm:text-sm"
                  >
                    {item}
                  </Badge>
                ))
              ) : (
                <span className="text-sm sm:text-base">N/A</span>
              )}
            </div>
          </div>

          <div className="w-full items-center gap-1 sm:gap-1.5">
            <Label className="font-bold text-sm sm:text-base">Resume</Label>

            <div className="mt-1">
              {user?.profile?.resumeOriginalName ? (
                <a
                  target="_blank"
                  href={user?.profile?.resume}
                  className="text-skyBlue w-full hover:underline text-sm sm:text-base break-all"
                >
                  {user?.profile?.resumeOriginalName}
                </a>
              ) : (
                <span className="text-sm sm:text-base">N/A</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8">
          <h1 className="font-semibold text-base sm:text-lg my-3 sm:my-5">
            Applied Jobs
          </h1>
          <AppliedJobsTable />
        </div>

        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  )
}

export default Profile
