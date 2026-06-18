import { Navigate } from 'react-router-dom';
import { isLoggedIn, getRole } from '../utils/auth.js';
import DashboardNavbar from './DashboardNavbar.jsx';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isLoggedIn()) {
    console.log('Not logged in');
    return <Navigate to="/login" replace />;
  }

  const role = getRole();
  console.log('role', role);
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <DashboardNavbar title="Hospital Portal" />
      <div className="p-4">
        {children}
      </div>
    </>
  );
}