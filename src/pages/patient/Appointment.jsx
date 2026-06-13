import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppointmentAPI } from "../../api/AppointmentApi";
import { PrescriptionAPI } from "../../api/PrescriptionApi";

export default function Appointment() {
  const { doctorId } = useParams();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const patientId = 2;
  const allStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED"];

  // ================= FETCH =================
  const getAppointments = async (pageNo = page) => {
    try {
      setLoading(true);

      const res = await AppointmentAPI.getAll(
        doctorId,
        patientId,
        filters.startDate,
        filters.endDate,
        filters.status,
        pageNo,
        3
      );

      setAppointments(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);
      setPage(pageNo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) getAppointments(0);
  }, [doctorId]);

  // ================= PRESCRIPTION =================
  const fetchPrescriptions = async (appointmentId) => {
    try {
      const res =
        await PrescriptionAPI.getappointmentprescription(appointmentId);

      setSelectedPrescription(res.data.data || res.data);
      setShowModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          My Appointments
        </h1>

        {/* ================= FILTER CARD ================= */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <div className="grid md:grid-cols-4 gap-3">

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border p-2 rounded-lg"
            >
              <option value="">All</option>
              {allStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setFilters({ startDate: "", endDate: "", status: "" });
                getAppointments(0);
              }}
              className="bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && <p className="text-center">Loading...</p>}

        {/* EMPTY */}
        {!loading && appointments.length === 0 && (
          <p className="text-center text-gray-500">
            No appointments found
          </p>
        )}

        {/* ================= CARDS ================= */}
        <div className="grid md:grid-cols-2 gap-5">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">

                <h2 className="font-semibold text-gray-800">
                  {a.date}
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded ${a.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : a.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {a.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {a.startTime} - {a.endTime}
              </p>

              <p className="mt-2">
                <b>Doctor:</b> {a.doctorName}
              </p>

              <p>
                <b>Reason:</b> {a.reason}
              </p>

              {a.notes && (
                <p>
                  <b>Notes:</b> {a.notes}
                </p>
              )}

              {a.status === "COMPLETED" && (
                <button
                  onClick={() => fetchPrescriptions(a.id)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  View Prescription
                </button>
              )}
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => getAppointments(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => getAppointments(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && selectedPrescription && (
        <div
          onClick={() => setShowModal(false)} // ✅ click outside closes
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // ❗ prevent inside click close
            className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">
              Prescription
            </h2>

            <p><b>Doctor:</b> {selectedPrescription.doctorName}</p>
            <p><b>Patient:</b> {selectedPrescription.patientName}</p>
            <p>
              <b>Date:</b>{" "}
              {new Date(selectedPrescription.createdAt).toLocaleString()}
            </p>

            <h3 className="mt-4 font-semibold">Medicines</h3>

            <ul className="list-disc ml-5">
              {selectedPrescription.medicines?.map((m, i) => (
                <li key={i}>
                  {m.medicineName} - {m.dosage} ({m.days} days)
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