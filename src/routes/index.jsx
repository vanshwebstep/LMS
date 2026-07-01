import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { ROLES } from '../utils/constants'
import PlaceholderPage from '../components/common/PlaceholderPage'
import RootRedirect from './RootRedirect'

// Layouts
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import CoachLayout from '../layouts/CoachLayout'
import StudentLayout from '../layouts/StudentLayout'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import VerifyEmail from '../pages/auth/VerifyEmail'

// Super Admin pages
import AdminDashboard from '../pages/superadmin/AdminDashboard'
import AdminCourseDetail from '../pages/superadmin/CourseDetail'
import AdminProfile from '../pages/superadmin/AdminProfile'

// Coach pages
import CoachDashboard from '../pages/coach/CoachDashboard'
import MyCourses from '../pages/coach/MyCourses'
import CreateCourse from '../pages/coach/CreateCourse'
import CoachCourseDetail from '../pages/coach/CourseDetail'
import ManageLessons from '../pages/coach/ManageLessons'
import CreateLesson from '../pages/coach/CreateLesson'
import ManageTopics from '../pages/coach/ManageTopics'
import ManageQuizzes from '../pages/coach/ManageQuizzes'
import CreateQuiz from '../pages/coach/CreateQuiz'
import ManageAssignments from '../pages/coach/ManageAssignments'
import UploadMaterials from '../pages/coach/UploadMaterials'
import PricingPlans from '../pages/coach/PricingPlans'
import MyStudents from '../pages/coach/MyStudents'
import StudentProgress from '../pages/coach/StudentProgress'
import CoachEarnings from '../pages/coach/CoachEarnings'
import CoachSettings from '../pages/coach/CoachSettings'

// Student pages
import StudentDashboard from '../pages/student/StudentDashboard'
import CourseCatalog from '../pages/student/CourseCatalog'
import StudentCourseDetail from '../pages/student/CourseDetail'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
      { path: '/verify-email/:token', element: <VerifyEmail /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin/dashboard', element: <AdminDashboard /> },
          { path: '/admin/coaches', element: <PlaceholderPage title="Coaches" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/admin/students', element: <PlaceholderPage title="Students" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/admin/courses', element: <PlaceholderPage title="Courses" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/admin/courses/:id', element: <AdminCourseDetail /> },
          { path: '/admin/payments', element: <PlaceholderPage title="Payments" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/admin/subscriptions', element: <PlaceholderPage title="Subscriptions" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/admin/reports', element: <PlaceholderPage title="Reports" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/admin/settings', element: <PlaceholderPage title="Platform Settings" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/admin/profile', element: <AdminProfile /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.COACH]} />,
    children: [
      {
        element: <CoachLayout />,
        children: [
          { path: '/coach/dashboard', element: <CoachDashboard /> },
          { path: '/coach/my-courses', element: <MyCourses /> },
          { path: '/coach/create-course', element: <CreateCourse /> },
          { path: '/coach/course-detail/:id', element: <CoachCourseDetail /> },
          { path: '/coach/edit-course/:id', element: <PlaceholderPage title="Edit Course" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/coach/manage-lessons', element: <ManageLessons /> },
          { path: '/coach/create-lesson', element: <CreateLesson /> },
          { path: '/coach/manage-topics', element: <ManageTopics /> },
          { path: '/coach/quizzes', element: <ManageQuizzes /> },
          { path: '/coach/create-quiz', element: <CreateQuiz /> },
          { path: '/coach/assignments', element: <ManageAssignments /> },
          { path: '/coach/upload-materials', element: <UploadMaterials /> },
          { path: '/coach/pricing-plans', element: <PricingPlans /> },
          { path: '/coach/my-students', element: <MyStudents /> },
          { path: '/coach/students/:id/progress', element: <StudentProgress /> },
          { path: '/coach/earnings', element: <CoachEarnings /> },
          { path: '/coach/settings', element: <CoachSettings /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.STUDENT]} />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { path: '/student/dashboard', element: <StudentDashboard /> },
          { path: '/student/courses', element: <CourseCatalog /> },
          { path: '/student/courses/:id', element: <StudentCourseDetail /> },
          { path: '/student/my-learning', element: <PlaceholderPage title="My Learning" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/student/progress', element: <PlaceholderPage title="Progress" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/student/certificates', element: <PlaceholderPage title="Certificates" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/student/profile', element: <PlaceholderPage title="Profile" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/student/settings', element: <PlaceholderPage title="Settings" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/student/checkout/:planId', element: <PlaceholderPage title="Checkout" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/student/payment/success', element: <PlaceholderPage title="Payment Success" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
          { path: '/student/payment/failed', element: <PlaceholderPage title="Payment Failed" description="This frontend screen is wired into navigation and ready for the backend-backed module." /> },
        ],
      },
    ],
  },
  { path: '/', element: <RootRedirect /> },
  { path: '*', element: <RootRedirect /> },
])

export default router

