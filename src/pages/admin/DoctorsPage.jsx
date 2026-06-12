import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAPI } from "../../api/AdminApi";

const DoctorsPage = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Filters
  const [filters, setFilters] = useState({
    name: "",
    specialization: "",
    status: "",
  });

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await AdminAPI.getDoctors(
        filters.name,
        filters.specialization,
        filters.status,
        page,
        size
      );

      const data = res.data;

      setDoctors(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  // ✅ Auto API call (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDoctors();
    }, 400);

    return () => clearTimeout(delay);
  }, [filters, page]);

  // ✅ Toggle ACTIVE / INACTIVE
  const toggleStatus = async (doctor) => {
    try {
      const newStatus =
        doctor.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await AdminAPI.updateDoctor(doctor.doctorId, {
        status: newStatus,
      });

      fetchDoctors();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctors Management</h1>

      {/* ✅ Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name"
          className="border p-2 rounded"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Search by Specialization"
          className="border p-2 rounded"
          value={filters.specialization}
          onChange={(e) =>
            setFilters({
              ...filters,
              specialization: e.target.value,
            })
          }
        />

        <select
          className="border p-2 rounded"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <tr key={doc.doctorId} className="border-t">
                  <td className="p-3">{doc.doctorName}</td>
                  <td className="p-3">{doc.email}</td>
                  <td className="p-3">{doc.specialization}</td>
                  <td className="p-3">{doc.experience} yrs</td>
                  <td className="p-3">₹{doc.consultationFee}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        doc.status === "ACTIVE"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    {/* Toggle */}
                    <button
                      onClick={() => toggleStatus(doc)}
                      className={`px-3 py-1 rounded text-white ${
                        doc.status === "ACTIVE"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {doc.status === "ACTIVE"
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    {/* Availability */}
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/doctors/${doc.doctorId}/availability`
                        )
                      }
                      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Availability
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  {loading ? "Loading..." : "No doctors found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm font-medium">
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

export default DoctorsPage;