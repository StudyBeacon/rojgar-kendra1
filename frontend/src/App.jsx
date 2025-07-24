import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import Home from "./components/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Jobs from "./components/Jobs"
import Browse from "./components/Browse"
import Profile from "./components/Profile"
import JobDescription from "./components/JobDescription"
import Companies from "./components/recruiter/Companies"
import CompanyCreate from "./components/recruiter/CompanyCreate"
import CompanyProfile from "./components/recruiter/CompanyProfile"
import MyJobs from "./components/recruiter/MyJobs"
import PostJob from "./components/recruiter/PostJob"
import Applicants from "./components/recruiter/Applicants"
import ProtectedRoute from "./components/recruiter/ProtectedRoute"
import ResumeBuilder from "./components/ResumeBuilder"; // ✅ Added resume route
import CareerBot from "./components/CareerBot"; 


// ✅ Added CareerBot component
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:jobId",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/my-companies",
    element: (
      <ProtectedRoute>
        <Companies />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/register-company",
    element: (
      <ProtectedRoute>
        <CompanyCreate />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-companies/:companyId",
    element: (
      <ProtectedRoute>
        <CompanyProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-jobs",
    element: (
      <ProtectedRoute>
        <MyJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/post-job",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-jobs/:jobId/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/resume-builder",
    element: (
      <ProtectedRoute>
        <ResumeBuilder />
      </ProtectedRoute>
    )
  },

])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
      <CareerBot /> {/* ✅ Render CareerBot component */}
    </div>
  )
}

export default App
