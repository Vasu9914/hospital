import React, { useEffect, useState } from "react";
import { AvailabilityAPI } from "../../api/AvailabilityApi.js";
import { toast } from "react-toastify";
import DatePicker from "../../components/DatePicker.jsx";
import { formatDisplayDate, formatTime } from "../../utils/helper.js";

export default function AvailabilityPage() {
  const [data, setData] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  const [filters, setFilters] = useState({
    doctorId: 3,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    availabilityStatus: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Modal state
  const [showModal, setShowModal] = useState(false);

  // ================= FETCH =================
  const fetchAvailability = async (page = 0) => {
    try {
      setLoading(true);

      const response = await AvailabilityAPI.get(
        filters.doctorId,
        filters.startDate,
        filters.endDate,
        filters.availabilityStatus,
        page,
        pageInfo.size
      );

      const res = response.data;

      setData(res.content);
      setPageInfo({
        page: res.page,
        size: res.size,
        totalPages: res.totalPages,
        totalElements: res.totalElements,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch availability");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteAvailability = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await AvailabilityAPI.delete(id);
      toast.success("Deleted successfully");
      fetchAvailability(pageInfo.page);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ================= AUTO FILTER =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAvailability(0);
    }, 400);

    return () => clearTimeout(delay);
  }, [filters]);

  // ================= FILTER CHANGE =================
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ================= PAGINATION =================
  const goToPage = (newPage) => {
    if (newPage < 0 || newPage >= pageInfo.totalPages) return;
    fetchAvailability(newPage);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Doctor Availability
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Availability
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
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
                name="availabilityStatus"
                value={filters.availabilityStatus}
                onChange={handleFilterChange}
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl shadow-sm bg-white"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    doctorId: filters.doctorId,
                    startDate: "",
                    endDate: "",
                    availabilityStatus: "",
                  })
                }
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-6">Loading...</p>
          ) : (
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Start</th>
                  <th className="p-3 text-left">End</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{item.id}</td>
                      <td className="p-3">{formatDisplayDate(item.date)}</td>
                      <td className="p-3">{formatTime(item.startTime)}</td>
                      <td className="p-3">{formatTime(item.endTime)}</td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            item.availabilityStatus === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.availabilityStatus}
                        </span>
                      </td>

                      <td className="p-3">
                        {item.availabilityStatus === "ACTIVE" && (
                          <button
                            onClick={() => deleteAvailability(item.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => goToPage(pageInfo.page - 1)}
            disabled={pageInfo.page === 0}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {pageInfo.page + 1} of {pageInfo.totalPages}
          </span>

          <button
            onClick={() => goToPage(pageInfo.page + 1)}
            disabled={pageInfo.page + 1 >= pageInfo.totalPages}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            <AddAvailabilityForm
              onClose={() => {
                setShowModal(false);
                fetchAvailability(pageInfo.page);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}






// ================= FORM COMPONENT =================
function AddAvailabilityForm({ onClose }) {
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const doctorId = 3;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.startTime >= form.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      await AvailabilityAPI.add({
        doctorId,
        ...form,
      });

      toast.success("Availability added successfully");

      setForm({
        date: "",
        startTime: "",
        endTime: "",
      });

      onClose(); // close modal + refresh
    } catch (err) {
      console.error(err);
      toast.error("Failed to add availability");
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Add Availability
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <DatePicker
            label="Date"
            value={form.date}
            onChange={(date) => setForm({ ...form, date })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Availability
        </button>
      </form>
    </>
  );
}