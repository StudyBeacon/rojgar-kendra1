// frontend/src/components/recruiter/MyJobsTable.jsx

import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setMyAllJobs } from "@/redux/jobSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyJobsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myAllJobs, searchJobText } = useSelector((state) => state.job);
  const [filterJobs, setFilterJobs] = useState(myAllJobs);

  // Filter jobs based on search text
  useEffect(() => {
    const filtered = myAllJobs.filter((job) => {
      if (!searchJobText) return true;
      return (
        job.title.toLowerCase().includes(searchJobText.toLowerCase()) ||
        job.company.companyName
          .toLowerCase()
          .includes(searchJobText.toLowerCase())
      );
    });
    setFilterJobs(filtered);
  }, [myAllJobs, searchJobText]);

  // Delete job handler
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/${jobId}`,
        { withCredentials: true }
      );
      // Remove job from Redux store
      const updated = myAllJobs.filter((j) => j._id !== jobId);
      dispatch(setMyAllJobs(updated));
    } catch (err) {
      console.error("Delete job error:", err.response?.data || err.message);
      alert("Failed to delete job. Please try again.");
    }
  };

  return (
    <div>
      <Table className="border border-gray-200 rounded-xl text-darkBlue">
        <TableCaption>
          {filterJobs.length === 0
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
          {filterJobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job.company.companyName}</TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-darkBlue space-y-2">
                    {/* View Applicants */}
                    <div
                      onClick={() =>
                        navigate(`/my-jobs/${job._id}/applicants`)
                      }
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>

                    {/* Delete Job */}
                    <div
                      onClick={() => handleDeleteJob(job._id)}
                      className="flex items-center gap-2 w-fit cursor-pointer text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4" />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}