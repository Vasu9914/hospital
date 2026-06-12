import React, { useEffect, useState } from "react";
import { SlotAPI } from "../../api/SlotAPI";
import { DoctorAPI } from "../../api/DoctorApi";
import { toast } from "react-toastify";

export default function SlotsPage() {
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);

  // filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [slotStatus, setSlotStatus] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  // ================= FETCH SLOTS =================
  const fetchSlots = async () => {
    try {
      setLoading(true);

      const res = await SlotAPI.getAll(
        doctorId || null, // ✅ important
        startDate,
        endDate,
        slotStatus,
        page,
        size
      );

      const data = res.data;

      setSlots(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH DOCTORS =================
    const fetchDoctors = async () => {
      try {
        const res = await DoctorAPI.getDoctors();
        setDoctors(res.data.content); // adjust if needed
      } catch (err) {
        console.error(err);
      }
    };

  // ================= EFFECTS =================
  useEffect(() => {
    fetchSlots();
  }, [page, startDate, endDate, slotStatus, doctorId]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await SlotAPI.delete(id);
      toast.success("Slot deleted");
      fetchSlots();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
      case "BOOKED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= UI =================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Slots</h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6 relative">

        {/* Doctor Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Doctor"
            value={doctorName}
            onChange={(e) => {
              setDoctorName(e.target.value);
            }}
            className="border px-3 py-2 rounded-lg w-60"
          />

          {/* Dropdown */}
          {doctorName && (
            <div className="absolute bg-white border w-full shadow z-10 max-h-40 overflow-y-auto">
              {doctors
                .filter((doc) =>
                  doc.doctorName
                    .toLowerCase()
                    .includes(doctorName.toLowerCase())
                )
                .map((doc) => (
                  <div
                    key={doc.doctorId}
                    onClick={() => {
                      setDoctorName(doc.doctorName);
                      setDoctorId(doc.doctorId); // ✅ important
                      setPage(0);                    
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {doc.doctorName}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Date Filters */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(0);
          }}
          className="border px-3 py-2 rounded-lg"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(0);
          }}
          className="border px-3 py-2 rounded-lg"
        />

        {/* Status Filter */}
        <select
          value={slotStatus}
          onChange={(e) => {
            setSlotStatus(e.target.value);
            setPage(0);
          }}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="BOOKED">BOOKED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        {/* Clear Button */}
        <button
          onClick={() => {
            setDoctorName("");
            setDoctorId("");
            setStartDate("");
            setEndDate("");
            setSlotStatus("");
          }}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Doctor</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Start</th>
                <th className="px-3 py-2">End</th>
                <th className="px-3 py-2">Fee</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {slots.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6">
                    No slots found
                  </td>
                </tr>
              ) : (
                slots.map((slot) => (
                  <tr key={slot.slotId} className="border-t">
                    <td className="px-3 py-2">{slot.slotId}</td>
                    <td className="px-3 py-2">{slot.doctorName}</td>
                    <td className="px-3 py-2">{slot.date}</td>
                    <td className="px-3 py-2">{slot.startTime}</td>
                    <td className="px-3 py-2">{slot.endTime}</td>
                    <td className="px-3 py-2">₹{slot.fee}</td>

                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(slot.slotStatus)}`}>
                        {slot.slotStatus}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <button
                        disabled={slot.slotStatus !== "AVAILABLE"}
                        onClick={() => handleDelete(slot.slotId)}
                        className={`px-2 py-1 rounded text-white text-xs ${
                          slot.slotStatus === "AVAILABLE"
                            ? "bg-red-500"
                            : "bg-gray-300"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}