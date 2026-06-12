import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvailabilityAPI } from "../../api/AvailabilityApi";

export default function AvailabilityPage() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  const [filters, setFilters] = useState({
    doctorId: 3,
    startDate: "",
    endDate: "",
    availabilityStatus: "",
  });

  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteAvailability = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this availability?"
    );
    if (!confirmDelete) return;

    try {
      await AvailabilityAPI.delete(id);
      fetchAvailability(pageInfo.page);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= AUTO FILTER (DEBOUNCE) =================
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

  // ================= UI =================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Doctor Availability
          </h2>

          <button
            onClick={() => navigate("/doctor/availability/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Availability
          </button>
        </div>

        {/* FILTERS (AUTO SEARCH) */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="availabilityStatus"
            value={filters.availabilityStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
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
                      <td className="p-3">{item.date}</td>
                      <td className="p-3">{item.startTime}</td>
                      <td className="p-3">{item.endTime}</td>

                      {/* STATUS */}
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

                      {/* ACTION */}
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

          <span className="text-gray-700">
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
    </div>
  );
}