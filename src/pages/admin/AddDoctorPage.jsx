import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/AdminApi";

const AddDoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Form state (MATCH BACKEND DTO)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    bio: "",
    consultationFee: "",
    experience: "",
    specialization: "",
    dateOfBirth: "",
    gender: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const SPECIALIZATIONS = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
  ];

  const GENDERS = ["MALE", "FEMALE", "OTHER"];

  // ✅ Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.getAllDoctors();
      setDoctors(res.data.data.content);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit (CREATE + UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      consultationFee: Number(form.consultationFee),
      experience: Number(form.experience),
    };

    try {
      if (isEdit) {
        await AdminAPI.updateDoctor(selectedId, payload);
      } else {
        await AdminAPI.createDoctor(payload);
      }

      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // ✅ Edit doctor
  const handleEdit = (doc) => {
    setForm({
      name: doc.name || doc.doctorName || "",
      email: doc.email || "",
      phoneNumber: doc.phoneNumber || "",
      bio: doc.bio || "",
      consultationFee: doc.consultationFee || "",
      experience: doc.experience || "",
      specialization: doc.specialization || "",
      dateOfBirth: doc.dateOfBirth || "",
      gender: doc.gender || "",
    });

    setSelectedId(doc.id || doc.doctorId);
    setIsEdit(true);
  };

  // ✅ Reset form
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phoneNumber: "",
      bio: "",
      consultationFee: "",
      experience: "",
      specialization: "",
      dateOfBirth: "",
      gender: "",
    });

    setIsEdit(false);
    setSelectedId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Doctor Management</h1>

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow"
      >
        <input name="name" placeholder="Name" className="border p-2 rounded" value={form.name} onChange={handleChange} required />

        <input name="email" placeholder="Email" className="border p-2 rounded" value={form.email} onChange={handleChange} required />

        <input name="phoneNumber" placeholder="Phone Number" className="border p-2 rounded" value={form.phoneNumber} onChange={handleChange} required />

        <input type="number" name="consultationFee" placeholder="Consultation Fee" className="border p-2 rounded" value={form.consultationFee} onChange={handleChange} required />

        <input type="number" name="experience" placeholder="Experience (years)" className="border p-2 rounded" value={form.experience} onChange={handleChange} required />

        <select name="specialization" className="border p-2 rounded" value={form.specialization} onChange={handleChange} required>
          <option value="">Select Specialization</option>
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>

        <input type="date" name="dateOfBirth" className="border p-2 rounded" value={form.dateOfBirth} onChange={handleChange} required />

        <select name="gender" className="border p-2 rounded" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <input name="bio" placeholder="Bio" className="border p-2 rounded md:col-span-3" value={form.bio} onChange={handleChange} />

        {/* Buttons */}
        <div className="md:col-span-3 flex gap-4">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              isEdit ? "bg-yellow-500" : "bg-blue-500"
            }`}
          >
            {isEdit ? "Update Doctor" : "Add Doctor"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ✅ Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Specialization</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <tr key={doc.id || doc.doctorId} className="border-t">
                  <td className="p-3">{doc.name || doc.doctorName}</td>
                  <td className="p-3">{doc.email}</td>
                  <td className="p-3">{doc.phoneNumber}</td>
                  <td className="p-3">{doc.specialization}</td>
                  <td className="p-3">{doc.experience}</td>
                  <td className="p-3">₹{doc.consultationFee}</td>

                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  {loading ? "Loading..." : "No doctors found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddDoctorPage; 