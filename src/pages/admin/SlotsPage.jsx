import React, { useEffect, useState } from "react";
import { SlotAPI } from "../../api/SlotApi";
import { DoctorAPI } from "../../api/DoctorApi";
import { toast } from "react-toastify";
import DatePicker from "../../components/DatePicker";
import { formatDisplayDate, formatTime } from "../../utils/helper";

export default function SlotsPage() {
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);

  // filters
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
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
   {/* 🔍 FILTER CARD */}
<div className="bg-white p-5 rounded-xl shadow-sm mb-6">
  <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter slots</h3>
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

    {/* Doctor */}
    <div className="relative">
      <label className="text-xs text-gray-500 mb-1 block">Doctor</label>

      <input
        type="text"
        placeholder="Search doctor..."
        value={doctorName}
        onChange={(e) => setDoctorName(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      {doctorName && (
        <div className="absolute bg-white border w-full mt-1 rounded-lg shadow z-20 max-h-40 overflow-y-auto">
          {doctors
            .filter((doc) =>
              doc.doctorName.toLowerCase().includes(doctorName.toLowerCase())
            )
            .map((doc) => (
              <div
                key={doc.doctorId}
                onClick={() => {
                  setDoctorName(doc.doctorName);
                  setDoctorId(doc.doctorId);
                  setPage(0);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {doc.doctorName}
              </div>
            ))}
        </div>
      )}
    </div>

    <DatePicker
      label="From"
      value={startDate}
      onChange={(value) => {
        setStartDate(value);
        setPage(0);
      }}
    />

    <DatePicker
      label="To"
      value={endDate}
      onChange={(value) => {
        setEndDate(value);
        setPage(0);
      }}
      minDate={startDate}
    />

    {/* Status */}
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
      <select
        value={slotStatus}
        onChange={(e) => {
          setSlotStatus(e.target.value);
          setPage(0);
        }}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white"
      >
        <option value="">All</option>
        <option value="AVAILABLE">Available</option>
        <option value="BOOKED">Booked</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>

    {/* Clear */}
    <div className="flex items-end">
      <button
        onClick={() => {
          setDoctorName("");
          setDoctorId("");
          setStartDate("");
          setEndDate("");
          setSlotStatus("");
          setPage(0);
        }}
        className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
      >
        Clear
      </button>
    </div>

  </div>
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
                    <td className="px-3 py-2">{formatDisplayDate(slot.date)}</td>
                    <td className="px-3 py-2">{formatTime(slot.startTime)}</td>
                    <td className="px-3 py-2">{formatTime(slot.endTime)}</td>
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