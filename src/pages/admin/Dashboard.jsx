import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/AdminApi";

export const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Filters
  const [filters, setFilters] = useState({
    doctorName: null,
    specialization: null,
    startDate: null,
    endDate: null,
  });

  // ✅ Static specialization (BEST UX)
  const SPECIALIZATIONS = [
    "cardiology",
    "dermatology",
    "neurology",
    "pediatrics",
    "psychiatry",
    "radiology",
    "Surgery",
  ];

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Dashboard Cards
  const fetchDashboard = async () => {
    try {
      const res = await AdminAPI.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Stats API
  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await AdminAPI.getStats(
        filters.doctorName,
        filters.specialization,
        filters.startDate,
        filters.endDate,
        page,
        size
      );
      console.log("Stats API Response:", res.data);

      const data = res.data;

      setStats(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  // ✅ Auto search (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStats();
    }, 400);

    return () => clearTimeout(delay);
  }, [filters, page]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ✅ Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Doctors" value={dashboard.totalDoctors} color="blue" />
        <Card title="Active Doctors" value={dashboard.activeDoctors} color="green" />
        <Card title="Inactive Doctors" value={dashboard.inactiveDoctors} color="red" />
        <Card title="Appointments" value={dashboard.totalAppointments} color="purple" />
      </div>

      {/* ✅ Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Doctor Name"
          className="border p-2 rounded"
          value={filters.doctorName}
          onChange={(e) =>
            setFilters({ ...filters, doctorName: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          value={filters.specialization}
          onChange={(e) =>
            setFilters({ ...filters, specialization: e.target.value })
          }
        >
          <option value={null}>All Specializations</option>
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />
      </div>

      {/* ✅ Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Specialization</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Completed</th>
              <th className="p-3 text-left">Pending</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : stats.length > 0 ? (
              stats.map((doc) => (
                <tr key={doc.id} className="border-t">
                  <td className="p-3">{doc.name}</td>
                  <td className="p-3">{doc.specialization}</td>
                  <td className="p-3">{doc.totalAppointments}</td>
                  <td className="p-3 text-green-600">
                    {doc.completedAppointments}
                  </td>
                  <td className="p-3 text-red-600">
                    {doc.pendingAppointments}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// ✅ Reusable Card Component
const Card = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={`${colors[color]} text-white p-4 rounded shadow`}>
      <h2 className="text-sm">{title}</h2>
      <p className="text-2xl font-bold">{value || 0}</p>
    </div>
  );
};