import React, { useEffect, useState } from 'react';
import { AppointmentAPI } from '../../api/AppointmentApi';
import { PrescriptionAPI } from '../../api/PrescriptionApi';

export default function Appointment() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // modal state
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // static (your case)
  const doctorId = 3;
  const patientId = 2;
  const allStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED"];

  const getAppointments = async () => {
    try {
      setLoading(true);

      const res = await AppointmentAPI.getAll(
        doctorId,
        patientId,
        startDate,
        endDate,
        appointmentStatus,
        page,
        3
      );

      console.log("Fetched Appointments:", res.data);

      setAppointments(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (appointmentId) => {
    try {
      const res = await PrescriptionAPI.getappointmentprescription(appointmentId);

      console.log("Prescription:", res.data);

      // adjust based on your ApiResponse
      setSelectedPrescription(res.data.data || res.data);
      setShowModal(true);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, [startDate, endDate, appointmentStatus, page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Appointments
        </h1>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <select
            value={appointmentStatus}
            onChange={(e) => setAppointmentStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All</option>
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setAppointmentStatus('');
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-center">Loading...</p>}

        {/* Empty */}
        {!loading && appointments.length === 0 && (
          <p className="text-center">No appointments found</p>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {appointments.map((a) => (
            <div key={a.id} className="border rounded-xl p-4 shadow bg-white">

              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">{a.date}</h2>

                <span className="text-xs px-2 py-1 rounded bg-gray-200">
                  {a.status}
                </span>
              </div>

              <p>{a.startTime} - {a.endTime}</p>

              <p><b>Doctor:</b> {a.doctorName}</p>

              <p><b>Reason:</b> {a.reason}</p>

              {a.notes && (
                <p><b>Notes:</b> {a.notes}</p>
              )}

              
              {a.status === "COMPLETED" && (
              <button
                onClick={() => fetchPrescriptions(a.id)}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                View Prescription
              </button>
              )}
          
            </div>
          ))}

        </div>

      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>

      </div>

      {/* ✅ MODAL */}
      {showModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Prescription</h2>

            <p><b>Doctor:</b> {selectedPrescription.doctorName}</p>
            <p><b>Patient:</b> {selectedPrescription.patientName}</p>
            <p><b>Date:</b> {selectedPrescription.date}</p>

            <h3 className="mt-4 font-semibold">Medicines</h3>
            <ul className="list-disc ml-5">
              {selectedPrescription.medicines?.map((m, i) => (
                <li key={i}>
                  {m.medicineName} - {m.dosage} - {m.days}
                </li>
              ))}
            </ul>

            <p className="mt-4">
              <b>Notes:</b> {selectedPrescription.notes}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}