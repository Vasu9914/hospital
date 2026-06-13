import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SlotAPI } from "../../api/SlotApi";
import { AppointmentAPI } from "../../api/AppointmentApi";

export default function SlotsPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  // ================= FETCH =================
  const getSlots = async (pageNo = page) => {
    try {
      setLoading(true);

      const res = await SlotAPI.getAll(
        doctorId,
        filters.startDate || undefined,
        filters.endDate || undefined,
        "AVAILABLE",
        pageNo,
        3
      );

      setSlots(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);
      setPage(pageNo);

    } catch (err) {
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) getSlots(0);
  }, [doctorId, filters]);

  // ================= BOOK =================
  const handleConfirmBooking = async () => {
    if (!reason) {
      toast.error("Reason required");
      return;
    }

    try {
      await AppointmentAPI.book({
        doctorId: selectedSlot.doctorId,
        patientId: 2,
        slotId: selectedSlot.slotId,
        reason,
        notes,
      });

      toast.success("Booked successfully");

      setShowModal(false);
      setReason("");
      setNotes("");
      setSelectedSlot(null);

      getSlots(page);

      navigate("/patient/appointments");
    } catch {
      toast.error("Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Available Slots
          </h1>

          <button
            onClick={() => navigate("/patient/appointments")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            My Appointments
          </button>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="grid md:grid-cols-3 gap-3">

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

            <button
              onClick={() => {
                setFilters({ startDate: "", endDate: "" });
                getSlots(0);
              }}
              className="bg-gray-200 rounded-lg"
            >
              Reset
            </button>

          </div>
        </div>

        {/* LOADING */}
        {loading && <p className="text-center">Loading...</p>}

        {/* SLOT CARDS */}
        <div className="grid md:grid-cols-2 gap-5">
          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="font-semibold text-gray-800">
                {slot.date}
              </p>

              <p className="text-sm text-gray-600">
                {slot.startTime} - {slot.endTime}
              </p>

              <p className="mt-2 font-medium text-blue-600">
                ₹{slot.fee}
              </p>

              <button
                onClick={() => {
                  setSelectedSlot(slot);
                  setShowModal(true);
                }}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg"
              >
                Book Slot
              </button>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => getSlots(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Prev
          </button>

          <span>
            Page {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => getSlots(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">

            <h2 className="text-lg font-semibold mb-3">
              Confirm Booking
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              {selectedSlot?.date} | {selectedSlot?.startTime} - {selectedSlot?.endTime}
            </p>

            <input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border p-2 w-full mb-3 rounded-lg"
            />

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 w-full mb-3 rounded-lg"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}