import React, { useState } from "react";
import { AvailabilityAPI } from "../../api/AvailabilityAPI";
import { toast } from "react-toastify";

export default function AddAvailability() {
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

    const payload = {
      doctorId,
      ...form,
    };

    try {
      await AvailabilityAPI.add(payload);
      toast.success("Availability added successfully");

      setForm({
        date: "",
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add availability");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add Availability
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Availability
          </button>
        </form>
      </div>
    </div>
  );
}