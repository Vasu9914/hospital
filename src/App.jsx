import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dashboard as PatientDashboard } from './pages/patient/Dashboard';
import { Dashboard as DoctorDashboard } from './pages/doctor/Dashboard';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import Appointment from './pages/patient/Appointment';
import SlotsSearch from './pages/patient/SlotsSearch';
import Profile from './pages/patient/Profile';
import { Profile as DoctorProfile } from './pages/doctor/Profile';
import DoctorAppointment from './pages/doctor/DoctorAppointment';
import CreatePrescription from './pages/doctor/CreatePrescription';
import EditPrescription from './pages/doctor/EditPrescription';
import DoctorSlots from './pages/doctor/DoctorSlots';
import AvailabilityPage from './pages/doctor/AvailabilityPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';
import AddDoctorPage from './pages/admin/AddDoctorPage';
import DoctorsPage from './pages/admin/DoctorsPage';
import SlotsPage from './pages/admin/SlotsPage';
import ForgetPassword from './pages/Forgetpassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerify from './pages/EmailVerify';
import VerifyTokenPage from './pages/VerifyTokenPage';
import { AvailabilityPage as AdminAvailabilityPage} from './pages/admin/AvailabilityPage';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
export default function App() {
  return (
    <BrowserRouter>

      <Routes>  
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* PATIENT only */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/appointment/:doctorId" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Appointment />
          </ProtectedRoute>
        } />
        <Route path="/patient/slots/:doctorId" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <SlotsSearch />
          </ProtectedRoute>
        } />
        <Route path="/patient/profile" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Profile />
          </ProtectedRoute>
        } />
      

        {/* DOCTOR only */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/doctor/profile" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorProfile />
          </ProtectedRoute>
        } />

        {/* <Route path="/doctor/appointments" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorAppointment />
          </ProtectedRoute>
        } /> */}
        <Route path="/doctor/prescription/create" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <CreatePrescription />
          </ProtectedRoute>
        } />
        <Route path="/doctor/availability/view" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <AvailabilityPage />
          </ProtectedRoute>
        } />
        <Route
          path="/doctor/prescription/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <EditPrescription />
            </ProtectedRoute>
          }
        />
        <Route path="/doctor/slots" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorSlots />
          </ProtectedRoute>
        } />
        
        {/* ADMIN only */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/appointments" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppointmentsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DoctorsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/slots" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <SlotsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/doctors/:doctorId/availability" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAvailabilityPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctor/add" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddDoctorPage />
          </  ProtectedRoute>
        } />

        <Route path="/auth/forgot" element={<ForgetPassword />} />
        <Route path="/auth/reset" element={<ResetPassword />} />
        <Route path="/auth/verify-email" element={<EmailVerify />} />
        <Route path="/auth/verification" element={<VerifyTokenPage />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* ✅ THIS WAS MISSING */}
      <ToastContainer position="top-right" autoClose={3000} />

    </BrowserRouter>
  );
}