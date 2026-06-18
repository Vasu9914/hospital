import React, { useEffect, useState } from "react";
import { SlotAPI } from "../../api/SlotAPI";
import { toast } from "react-toastify";
import DatePicker from "../../components/DatePicker";
import { formatDisplayDate, formatTime } from "../../utils/helper";

export default function DoctorSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    slotStatus: "",
  });

  // pagination
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  // ---------------------------
  // Fetch slots
  // ---------------------------
  const fetchSlots = async (pageNo = page) => {
    try {
      setLoading(true);

      const res = await SlotAPI.getAll(
        null,
        filters.startDate,
        filters.endDate,
        filters.slotStatus,
        pageNo,
        size
      );
      console.log("Fetched Slots:", res.data);
      const data = res.data;

      setSlots(data.content);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(0);
  }, [filters]);

  // ---------------------------
  // Handle filter change
  // ---------------------------
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------
  // Delete slot
  // ---------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return;

    try {
      await SlotAPI.delete(id);
      toast.success("Slot deleted");
      fetchSlots(page);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ---------------------------
  // Status badge
  // ---------------------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
      case "BOOKED":
        return "bg-red-100 text-red-700";
      case "CANCELLED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-6">Doctor Slots</h2>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Filter Slots
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

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

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
            <select
              name="slotStatus"
              value={filters.slotStatus}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-xl shadow-sm bg-white"
            >
              <option value="">All</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="BOOKED">BOOKED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">        
            <button
              onClick={() => {
                setFilters({
                  startDate: "",
                  endDate: "",
                  slotStatus: "",
                });
                fetchSlots(0);
              }}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-3 py-2">ID</th>
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
                  <td colSpan="7" className="text-center py-6">
                    No slots found
                  </td>
                </tr>
              ) : (
                slots.map((slot) => (
                  <tr key={slot.slotId} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{slot.slotId}</td>
                    <td className="px-3 py-2">{formatDisplayDate(slot.date)}</td>
                    <td className="px-3 py-2">{formatTime(slot.startTime)}</td>
                    <td className="px-3 py-2">{formatTime(slot.endTime)}</td>
                    <td className="px-3 py-2">₹{slot.fee}</td>

                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                          slot.slotStatus
                        )}`}
                      >
                        {slot.slotStatus}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <button
                        disabled={slot.slotStatus !== "AVAILABLE"}
                        onClick={() => handleDelete(slot.slotId)}
                        className={`px-2 py-1 rounded text-xs text-white ${
                          slot.slotStatus === "AVAILABLE"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-300 cursor-not-allowed"
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

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => fetchSlots(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => fetchSlots(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
} 