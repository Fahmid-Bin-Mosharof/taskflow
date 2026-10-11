import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import DashboardLayout from '../layouts/DashboardLayout'

const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Projects = lazy(() => import('../pages/Projects'))
const ProjectDetails = lazy(() => import('../pages/ProjectDetails'))
const MyTasks = lazy(() => import('../pages/MyTasks'))
const Calendar = lazy(() => import('../pages/Calendar'))
const Profile = lazy(() => import('../pages/Profile'))
const Settings = lazy(() => import('../pages/Settings'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function Router() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Open to everyone */}
        <Route path="/" element={<Home />} />

        {/* Guests only: logged-in users are sent to the dashboard */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Logged-in users only, all rendered inside the dashboard layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/projects" element={<Projects />} />
            <Route path="/dashboard/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/dashboard/tasks" element={<MyTasks />} />
            <Route path="/dashboard/calendar" element={<Calendar />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}