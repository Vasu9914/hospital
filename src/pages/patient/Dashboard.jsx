import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorAPI } from '../../api/DoctorApi';

export const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getDoctors = async (searchName, searchSpec, pageNo) => {
    try {
      setLoading(true);

      const res = await DoctorAPI.getDoctors(
        searchName,
        searchSpec,
        pageNo
      );

      setDoctors(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      getDoctors(name, specialization, page);
    }, 500);

    return () => clearTimeout(delay);
  }, [name, specialization, page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>

      {/* 🔍 Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search name..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setPage(0); // ✅ reset page
          }}
          className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Specialization..."
          value={specialization}
          onChange={(e) => {
            setSpecialization(e.target.value);
            setPage(0); // ✅ reset page
          }}
          className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {/* ❌ Empty */}
      {!loading && doctors.length === 0 && (
        <p className="text-center text-gray-500">
          No doctors found
        </p>
      )}

      {/* 👨‍⚕️ Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {doctors.map((doc) => (
          <div
            key={doc.doctorId}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{doc.doctorName}</h3>
            <p className="text-gray-600">{doc.specialization}</p>
            <p className="text-sm text-gray-500">
              {doc.experience} yrs experience
            </p>
            <p className="font-medium mt-1">
              ₹{doc.consultationFee}
            </p>

            <button
              className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={() => {
                navigate(`/patient/slots/${doc.doctorId}`);
              }}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">

        {/* Prev */}
        <button
          onClick={() =>
            setPage((prev) => Math.max(prev - 1, 0))
          }
          disabled={page === 0}
          className={`px-4 py-2 rounded ${
            page === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Prev
        </button>

        {/* Page Info */}
        <span className="font-medium">
          Page {page + 1} of {totalPages}
        </span>

        {/* Next */}
        <button
          onClick={() =>
            setPage((prev) =>
              Math.min(prev + 1, totalPages - 1)
            )
          }
          disabled={page >= totalPages - 1}
          className={`px-4 py-2 rounded ${
            page >= totalPages - 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>

      </div>
    </div>
  );
};