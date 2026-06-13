import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorAPI } from "../../api/DoctorApi";
import DashboardNavbar from "../../components/DashboardNavbar";

export const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);

  // filters
  const [filters, setFilters] = useState({
    name: "",
    specialization: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH =================
  const getDoctors = async (pageNo = 0) => {
    try {
      setLoading(true);

      const res = await DoctorAPI.getDoctors(
        filters.name,
        filters.specialization,
        pageNo
      );

      setDoctors(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);
      setPage(pageNo);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors(0);
  }, [filters]);

  // ================= FILTER CHANGE =================
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <DashboardNavbar
        title="Patient Dashboard"
        subtitle="Find doctors and book an appointment from one place."
      />

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Find Doctors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Name */}
          <div>
            <label className="text-xs text-gray-500">Doctor Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleChange}
              placeholder="Search name..."
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="text-xs text-gray-500">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={filters.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2 col-span-2">
            <button
              onClick={() => getDoctors(0)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>

            <button
              onClick={() => {
                setFilters({ name: "", specialization: "" });
                getDoctors(0);
              }}
              className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && doctors.length === 0 && (
        <p className="text-center text-gray-500">
          No doctors found
        </p>
      )}

      {/* ================= DOCTOR GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.doctorId}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {doc.doctorName}
            </h3>

            <p className="text-blue-600 text-sm font-medium">
              {doc.specialization}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {doc.experience} years experience
            </p>

            <p className="font-semibold mt-2 text-gray-800">
              ₹{doc.consultationFee}
            </p>

            <button
              onClick={() =>
                navigate(`/patient/slots/${doc.doctorId}`)
              }
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-4 mt-8">

        <button
          onClick={() => getDoctors(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => getDoctors(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
};