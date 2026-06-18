import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/AdminApi";
import DatePicker from "../../components/DatePicker";

const SPECIALIZATIONS = [
  "cardiology", "dermatology", "neurology",
  "pediatrics", "psychiatry", "radiology", "Surgery",
];

// 🔥 Card Component
const Card = ({ title, value, color }) => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-500",
    purple: "text-violet-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-semibold mt-1 ${colorMap[color]}`}>
        {value ?? 0}
      </p>
    </div>
  );
};

export const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    doctorName: "",
    specialization: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const SIZE = 5;

  // 🔹 Fetch dashboard cards
  const fetchDashboard = async () => {
    try {
      const res = await AdminAPI.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch table stats
  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await AdminAPI.getStats(
        filters.doctorName || null,
        filters.specialization || null,
        filters.startDate || null,
        filters.endDate || null,
        page,
        SIZE
      );

      setStats(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  // Debounce API call
  useEffect(() => {
    const t = setTimeout(fetchStats, 400);
    return () => clearTimeout(t);
  }, [filters, page]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      

      {/* 🔥 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Doctors" value={dashboard.totalDoctors} color="blue" />
        <Card title="Active Doctors" value={dashboard.activeDoctors} color="green" />
        <Card title="Inactive Doctors" value={dashboard.inactiveDoctors} color="red" />
        <Card title="Appointments" value={dashboard.totalAppointments} color="purple" />
      </div>

      {/* 🔍 Filters */}
      <div className="mb-6 bg-white p-5 rounded-2xl border shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter doctor stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Doctor name</label>
            <input
              type="text"
              placeholder="Search name..."
              value={filters.doctorName}
              onChange={(e) =>
                setFilters({ ...filters, doctorName: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Specialization</label>
            <select
              value={filters.specialization}
              onChange={(e) =>
                setFilters({ ...filters, specialization: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm shadow-sm bg-white"
            >
              <option value="">All specializations</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <DatePicker
            label="From"
            value={filters.startDate}
            onChange={(startDate) =>
              setFilters({ ...filters, startDate })
            }
          />

          <DatePicker
            label="To"
            value={filters.endDate}
            onChange={(endDate) =>
              setFilters({ ...filters, endDate })
            }
            minDate={filters.startDate}
          />

          <div className="flex items-end">
            <button
              type="button"
              onClick={() =>
                setFilters({
                  doctorName: "",
                  specialization: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {["Doctor", "Specialization", "Total", "Completed", "Pending"].map(
                (h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : stats.length > 0 ? (
              stats.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {doc.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {doc.specialization}
                  </td>
                  <td className="px-4 py-3">
                    {doc.totalAppointments}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    {doc.completedAppointments}
                  </td>
                  <td className="px-4 py-3 text-red-500 font-medium">
                    {doc.pendingAppointments}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔄 Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40"
        >
          ← Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
};