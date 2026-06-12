import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SlotAPI } from '../../api/SlotApi';
import { AppointmentAPI } from '../../api/AppointmentApi';

export default function SlotsPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate(); // ✅ added

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch slots
  const getSlots = async () => {
    try {
      setLoading(true);

      const res = await SlotAPI.getAll(
        doctorId,
        startDate || undefined,
        endDate || undefined,
        'AVAILABLE',
        page,
        3
      );

      setSlots(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);

    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch slots ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      getSlots();
    }
  }, [doctorId, startDate, endDate, page]);

  // Booking
  const handleConfirmBooking = async () => {
    try {
      if (!reason) {
        toast.error("Reason is required ❌");
        return;
      }

      const payload = {
        doctorId: selectedSlot.doctorId,
        patientId: 2, // replace later
        slotId: selectedSlot.slotId,
        reason,
        notes
      };

      await AppointmentAPI.book(payload);

      toast.success("Appointment booked ✅");

      setShowModal(false);
      setSelectedSlot(null);
      setReason('');
      setNotes('');

      getSlots();

      // ✅ OPTIONAL: auto redirect
      navigate('/patient/appointments');

    } catch (error) {
      console.log(error.response?.data);
      toast.error("Booking failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* ✅ HEADER WITH BUTTON */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-2xl font-bold">
            Slots (Doctor ID: {doctorId})
          </h1>

          <button
            onClick={() => navigate(`/patient/appointment/${doctorId}`)} // ✅ FIXED BUG HERE
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            My Appointments
          </button>

        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">

          <input
            type="date"
            value={startDate}
            onChange={(e) => {   // ✅ FIXED BUG HERE
              setStartDate(e.target.value);
              setPage(0);
            }}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            className="border p-2 rounded"
          />

          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setPage(0);
            }}
            className="bg-gray-400 text-white px-4 rounded"
          >
            Reset
          </button>

        </div>

        {/* Loading */}
        {loading && <p className="text-center">Loading...</p>}

        {/* Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {!loading && slots.length === 0 && (
            <p>No slots available</p>
          )}

          {slots.map((slot) => (
            <div key={slot.slotId} className="border p-4 rounded-lg shadow">

              <p><b>Doctor:</b> {slot.doctorName}</p>
              <p><b>Date:</b> {slot.date}</p>
              <p><b>Time:</b> {slot.startTime} - {slot.endTime}</p>
              <p><b>Fee:</b> ₹{slot.fee}</p>

              <button
                onClick={() => {
                  setSelectedSlot(slot);
                  setShowModal(true);
                }}
                className="mt-3 w-full bg-green-500 text-white py-2 rounded"
              >
                Book Slot
              </button>

            </div>
          ))}

        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Prev
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>

        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="text-lg font-bold mb-3">Book Appointment</h2>

            <p className="mb-2 text-sm text-gray-600">
              {selectedSlot?.date} | {selectedSlot?.startTime} - {selectedSlot?.endTime}
            </p>

            <input
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-blue-500 text-white rounded"
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