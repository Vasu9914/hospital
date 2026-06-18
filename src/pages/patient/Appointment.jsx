import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppointmentAPI } from "../../api/AppointmentApi.js";
import { PrescriptionAPI } from "../../api/PrescriptionApi.js";
import DatePicker from "../../components/DatePicker.jsx";
import { formatDisplayDate, formatTime } from "../../utils/helper.js";

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
      console.log(res.data?.content);
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
  }, [doctorId, filters]);

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
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Filter appointments
          </h3>
          <div className="grid md:grid-cols-4 gap-4">

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

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl shadow-sm"
              >
                <option value="">All</option>
                {allStatuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ startDate: "", endDate: "", status: "" });
                  getAppointments(0);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition"
              >
                Reset
              </button>
            </div>
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
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
            >
              <div className="flex justify-between items-start gap-3 mb-3">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    {formatDisplayDate(a.date, "short")}
                  </p>
                  <h2 className="font-semibold text-gray-800 mt-1">
                    {formatDisplayDate(a.date, "long")}
                  </h2>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${a.status === "CONFIRMED"
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
                {formatTime(a.startTime)} – {formatTime(a.endTime)}
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
              {formatDisplayDate(selectedPrescription.createdAt, "long")}{" "}
              at {formatTime(selectedPrescription.createdAt)}
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