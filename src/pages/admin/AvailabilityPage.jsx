import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvailabilityAPI } from "../../api/AvailabilityApi";
import { SlotAPI } from "../../api/SlotApi";
import { formatTime, formatDisplayDate } from "../../utils/helper";
import DatePicker from "../../components/DatePicker";

// ✅ Status badge
const statusBadge = (status) => {
  const map = {
    ACTIVE: "bg-green-500 text-white",
    INACTIVE: "bg-red-500 text-white",
  };

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
};

// ✅ Slot colors
const slotColors = {
  AVAILABLE: "bg-green-500 text-white",
  BOOKED: "bg-blue-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

// ================= HELPER =================
function generateTimeOptions(stepMinutes) {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const suffix = h < 12 ? "AM" : "PM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      times.push({
        value: `${hh}:${mm}`,
        label: `${displayH}:${mm} ${suffix}`,
      });
    }
  }
  return times;
}

export function AvailabilityPage() {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const [data, setData] = useState([]);
  const [slotsMap, setSlotsMap] = useState({});
  const [loadingSlots, setLoadingSlots] = useState({});
  const [loading, setLoading] = useState(false);

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    availabilityStatus: "",
  });

  // ADD MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: 30,
  });

  // Generate time slots based on selected duration
  const timeOptions = generateTimeOptions(Number(form.duration));

  // End time options: only show times after the selected start time
  const endTimeOptions = timeOptions.filter((t) => {
    if (!form.startTime) return true;
    return t.value > form.startTime;
  });

  // ---------------- FETCH ----------------
  const fetchAvailability = async (page = 0) => {
    try {
      setLoading(true);

      const res = await AvailabilityAPI.get(
        doctorId,
        filters.startDate || null,
        filters.endDate || null,
        filters.availabilityStatus || null,
        page,
        pageInfo.size
      );

      setData(res.data.content);
      setPageInfo({
        page: res.data.page,
        size: res.data.size,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH SLOTS ----------------
  const fetchSlots = async (availabilityId) => {
    if (slotsMap[availabilityId]) {
      setSlotsMap((prev) => {
        const n = { ...prev };
        delete n[availabilityId];
        return n;
      });
      return;
    }

    try {
      setLoadingSlots((prev) => ({ ...prev, [availabilityId]: true }));
      const res = await SlotAPI.getslotsbyavailability(availabilityId);
      setSlotsMap((prev) => ({ ...prev, [availabilityId]: res.data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots((prev) => ({ ...prev, [availabilityId]: false }));
    }
  };

  // ---------------- DELETE ----------------
  const deleteAvailability = async (id) => {
    if (!window.confirm("Delete this availability?")) return;
    try {
      await AvailabilityAPI.delete(id);
      fetchAvailability(pageInfo.page);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FORM CHANGE ----------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // When duration changes, reset start & end time
      // so stale values from previous step size don't remain
      if (name === "duration") {
        updated.startTime = "";
        updated.endTime = "";
      }

      // When start time changes, clear end time if it's no longer valid
      if (name === "startTime" && prev.endTime && value >= prev.endTime) {
        updated.endTime = "";
      }

      return updated;
    });
  };

  // ---------------- ADD AVAILABILITY ----------------
  const handleAddAvailability = async () => {
    if (!form.date || !form.startTime || !form.endTime || !form.duration) {
      alert("All fields required");
      return;
    }

    if (form.startTime >= form.endTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      await AvailabilityAPI.add({
        doctorId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        duration: Number(form.duration),
      });

      setForm({ date: "", startTime: "", endTime: "", duration: 30 });
      setShowAddModal(false);
      fetchAvailability(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchAvailability(0), 300);
    return () => clearTimeout(t);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Doctor Availability (ID: {doctorId})
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add Availability
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter availability</h3>
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

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white"
              value={filters.availabilityStatus}
              onChange={(e) =>
                setFilters({ ...filters, availabilityStatus: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() =>
                setFilters({ startDate: "", endDate: "", availabilityStatus: "" })
              }
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              {["ID", "Date", "Start", "End", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-6">Loading...</td></tr>
            ) : data.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{formatDisplayDate(item.date)}</td>
                  <td className="px-6 py-4">{formatTime(item.startTime)}</td>
                  <td className="px-6 py-4">{formatTime(item.endTime)}</td>
                  <td className="px-6 py-4">{statusBadge(item.availabilityStatus)}</td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => fetchSlots(item.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      {slotsMap[item.id] ? "Hide" : "Slots"}
                    </button>

                    <button
                      onClick={() => deleteAvailability(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Slots */}
                {slotsMap[item.id] && (
                  <tr>
                    <td colSpan={6} className="bg-gray-50 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {slotsMap[item.id].map((slot) => (
                          <div
                            key={slot.slotId}
                            className={`p-2 rounded text-center ${slotColors[slot.slotStatus]}`}
                          >
                            {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">

            <h3 className="text-lg font-semibold mb-4">Add Availability</h3>

            <div className="space-y-3">

              {/* Date */}
              <DatePicker
                label="Date"
                value={form.date}
                onChange={(date) => setForm({ ...form, date })}
              />

              {/* Duration — pick this first, drives the time dropdowns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select duration</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <select
                  name="startTime"
                  value={form.startTime}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded"
                  disabled={!form.duration}
                >
                  <option value="">Select start time</option>
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <select
                  name="endTime"
                  value={form.endTime}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded"
                  disabled={!form.startTime}
                >
                  <option value="">Select end time</option>
                  {endTimeOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setForm({ date: "", startTime: "", endTime: "", duration: 30 });
                }}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddAvailability}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
