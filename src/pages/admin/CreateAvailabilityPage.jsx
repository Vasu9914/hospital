import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvailabilityAPI } from "../../api/AvailabilityApi";
import { SlotAPI } from "../../api/SlotApi";
import { formatTime, formatDate } from "../../utils/helper";

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

export function CreateAvailabilityPage() {
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

  // 🔥 ADD MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
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

  // ---------------- ADD AVAILABILITY ----------------
  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAvailability = async () => {
    if (!form.date || !form.startTime || !form.endTime) {
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
        ...form,
      });

      setForm({
        date: "",
        startTime: "",
        endTime: "",
      });

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
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          + Add Availability
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="date"
          className="px-3 py-2 border rounded-md bg-white"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="px-3 py-2 border rounded-md bg-white"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />

        <select
          className="px-3 py-2 border rounded-md bg-white"
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
                  <td className="px-6 py-4">{formatDate(item.date)}</td>
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

      {/* 🔥 ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-[400px]">

            <h3 className="text-lg font-semibold mb-4">
              Add Availability
            </h3>

            <div className="space-y-3">

              <input type="date" name="date" value={form.date}
                onChange={handleFormChange} className="w-full border p-2 rounded" />

              <input type="time" name="startTime" value={form.startTime}
                onChange={handleFormChange} className="w-full border p-2 rounded" />

              <input type="time" name="endTime" value={form.endTime}
                onChange={handleFormChange} className="w-full border p-2 rounded" />

            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAddModal(false)} className="px-3 py-1 bg-gray-200 rounded">
                Cancel
              </button>

              <button onClick={handleAddAvailability} className="px-3 py-1 bg-green-600 text-white rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export default CreateAvailabilityPage;