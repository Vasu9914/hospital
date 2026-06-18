import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminAPI } from '../../api/AdminApi.js';
import { AppointmentAPI } from '../../api/AppointmentApi.js';
import DatePicker from '../../components/DatePicker.jsx';
import { formatDisplayDate, formatTime } from '../../utils/helper.js';


export const Dashboard = () => {
   const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
// today date
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");


  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [patientId, setPatientId] = useState("");
  const navigate = useNavigate();

  // ---------------------------
  // Fetch Appointments
  // ---------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await AppointmentAPI.getAll(
        null,
        patientId,
        startDate,
        endDate,
        appointmentStatus,
        page,
        size
      );
      console.log("Fetched Appointments:", res.data);

      const data = res.data;

      setAppointments(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, startDate, endDate, appointmentStatus, patientId]);

  // ---------------------------
  // Navigation Handlers
  // ---------------------------
  const handleAddPrescription = (appt) => {
    navigate("/doctor/prescription/create", {
      state: {
        appointmentId: appt.id,
        patientId: appt.patientId,
        doctorId: appt.doctorId,
        appointmentDate: appt.date,
        startTime: appt.startTime,
        endTime: appt.endTime,
        patientName: appt.patientName,
        doctorName: appt.doctorName,
        reason: appt.reason,        
      },
    });
  };

  const handleEdit = (appt) => {
    navigate(`/doctor/prescription/edit/${appt.id}`, {
      state: appt,
    });
  };

  // ---------------------------
  // UI Helpers
  // ---------------------------
  const AllStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED"];

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Appointments
      </h2>


      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Filter Appointments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Patient ID */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Patient ID</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <DatePicker
            label="From"
            value={startDate}
            onChange={setStartDate}
          />

          <DatePicker
            label="To"
            value={endDate}
            onChange={setEndDate}
            minDate={startDate}
          />

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={appointmentStatus}
              onChange={(e) => {
                setAppointmentStatus(e.target.value);
                setPage(0);
              }}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-xl shadow-sm bg-white"
            >
              <option value="">All</option>
              {AllStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setPatientId("");
                setStartDate("");
                setEndDate("");
                setAppointmentStatus("");
                setPage(0);
              }}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{appt.id}</td>
                    <td className="px-4 py-3">{formatDisplayDate(appt.date)}</td>
                    <td className="px-4 py-3">
                      {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">{appt.doctorName}</td>
                    <td className="px-4 py-3">{appt.patientName}</td>
                    <td className="px-4 py-3">{appt.reason}</td>

                    {/* Actions */}
                    <td className="px-4 py-3 flex gap-2">
                      {/* Prescription */}
                      <button
                        disabled={appt.status === "COMPLETED" || appt.status === "CANCELLED"}
                        onClick={() => handleAddPrescription(appt)}
                        className={`px-3 py-1 rounded-lg text-xs text-white ${appt.status === "CONFIRMED"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-300 cursor-not-allowed"
                          }`}
                      >
                        Prescription
                      </button>
                    {console.log(appt.status)}                      
                      {/* Edit */}
                      <button
                        disabled={appt.status !== "COMPLETED"}
                        onClick={() => handleEdit(appt)}
                        className= {`px-3 py-1 rounded-lg text-xs text-white bg-yellow-500 hover:bg-yellow-600 ${appt.status !== "COMPLETED" ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
        >
          Prev
        </button>

        <span className="text-gray-700">
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
