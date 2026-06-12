import { Navigate } from 'react-router-dom';
import { isLoggedIn, getRole } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(getRole())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}