import { Link, useNavigate } from 'react-router-dom';
import { getRole, removeToken } from '../utils/auth';

const navItemsByRole = {
  PATIENT: [
    { label: 'Dashboard', to: '/patient/dashboard' },
    { label: 'Profile', to: '/patient/profile' },
  ],
  ADMIN: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Doctors', to: '/admin/doctors' },
    { label: 'Appointments', to: '/admin/appointments' },
    { label: 'Slots', to: '/admin/slots' },
    { label: 'Add Doctor', to: '/admin/doctor/add' },
  ],
  DOCTOR: [
    { label: 'Dashboard', to: '/doctor/dashboard' },
    { label: 'Profile', to: '/doctor/profile' },
    { label: 'Appointments', to: '/doctor/appointments' },
    { label: 'View Availability', to: '/doctor/availability/view' }, 
    { label: 'Slots', to: '/doctor/slots' },
  ],
};

export default function DashboardNavbar({ title, subtitle }) {
  const navigate = useNavigate();
  const role = getRole();
  const navItems = navItemsByRole[role] || [];

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <header className="mb-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Hospital Portal
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}