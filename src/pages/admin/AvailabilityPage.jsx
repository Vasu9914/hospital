import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvailabilityAPI } from "../../api/AvailabilityApi";
import { SlotAPI } from "../../api/SlotApi";

export function AvailabilityPage() {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const [data, setData] = useState([]); // ✅ FIXED (missing)
  const [slotsMap, setSlotsMap] = useState({}); // ✅ store slots per availability
  const [loadingSlots, setLoadingSlots] = useState({}); // loading per row

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  const [filters, setFilters] = useState({
    doctorId: doctorId || "",
    startDate: "",
    endDate: "",
    availabilityStatus: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH AVAILABILITY =================
  const fetchAvailability = async (page = 0) => {
    if (!filters.doctorId) return;

    try {
      setLoading(true);

      const response = await AvailabilityAPI.get(
        doctorId,
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

  // ================= FETCH SLOTS =================
  const fetchSlots = async (availabilityId) => {
    try {
      setLoadingSlots((prev) => ({ ...prev, [availabilityId]: true }));

      const res = await SlotAPI.getslotsbyavailability(availabilityId);
      console.log("Slots for availability", availabilityId, res.data);
      setSlotsMap((prev) => ({
        ...prev,
        [availabilityId]: res.data, // store slots
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots((prev) => ({ ...prev, [availabilityId]: false }));
    }
  };

  // ================= DELETE =================
  const deleteAvailability = async (id) => {
    if (!window.confirm("Delete this availability?")) return;

    try {
      await AvailabilityAPI.delete(id);
      fetchAvailability(pageInfo.page);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= AUTO FILTER =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAvailability(0);
    }, 400);

    return () => clearTimeout(delay);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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
          <div>
            <button onClick={() => navigate(-1)} className="text-blue-600 text-sm mb-2">
              ← Back
            </button>
            <h2 className="text-2xl font-bold">
              Doctor Availability (ID: {doctorId})
            </h2>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-4 mb-6">
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border p-2 rounded"/>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border p-2 rounded"/>

          <select name="availabilityStatus" value={filters.availabilityStatus} onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {/* AVAILABILITY ROW */}
                <tr className="border-t">
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.startTime}</td>
                  <td>{item.endTime}</td>

                  <td>
                    <span className={item.availabilityStatus === "ACTIVE" ? "text-green-600" : "text-red-600"}>
                      {item.availabilityStatus}
                    </span>
                  </td>

                  <td className="flex gap-2">
                    <button
                      onClick={() => fetchSlots(item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Show Slots
                    </button>

                    {item.availabilityStatus === "ACTIVE" && (
                      <button
                        onClick={() => deleteAvailability(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>

                {/* SLOTS ROW */}
                {slotsMap[item.id] && (
                  <tr>
                    <td colSpan="6">
                      <div className="bg-gray-50 p-3">
                        {loadingSlots[item.id] ? (
                          <p>Loading slots...</p>
                        ) : (
                          <div className="grid grid-cols-4 gap-2">
                            {slotsMap[item.id].map((slot) => (
                              <div
                                key={slot.slotId}
                                className={`p-2 rounded text-center text-sm ${
                                  slot.slotStatus === "AVAILABLE"
                                    ? "bg-green-100"
                                    : slot.slotStatus === "BOOKED"
                                    ? "bg-blue-100"
                                    : "bg-red-100"
                                }`}
                              >
                                {slot.startTime} - {slot.endTime}
                                <br />
                                <span className="text-xs">
                                  {slot.slotStatus}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between mt-4">
          <button disabled={pageInfo.page === 0} onClick={() => goToPage(pageInfo.page - 1)}>
            Prev
          </button>

          <span>Page {pageInfo.page + 1} / {pageInfo.totalPages}</span>

          <button disabled={pageInfo.page + 1 >= pageInfo.totalPages} onClick={() => goToPage(pageInfo.page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}