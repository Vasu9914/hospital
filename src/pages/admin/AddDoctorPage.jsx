import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/AdminApi.js";
import { UserAPI } from "../../api/UserApi.js";
import { toast } from "react-toastify";
import DatePicker from "../../components/DatePicker";

const AddDoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [status, setStatus] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
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

  // Persist doctor form draft
  const doctorDraftKey = 'doctor_draft';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(doctorDraftKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm((f) => ({ ...f, ...parsed }));
      }
    } catch (err) {
      console.error('failed to load doctor draft', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(doctorDraftKey, JSON.stringify(form));
      } catch (err) {
        console.error('failed to save doctor draft', err);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [form]);

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
      const res = await AdminAPI.getDoctors(doctorName, specialization, status);
      console.log("Fetched doctors:", res.data);
      setDoctors(res.data.content);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [doctorName, specialization, status]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) {
      toast.error("Please choose a photo first");
      return;
    }
    if(!selectedId) {
      toast.error("Please save doctor details before uploading photo");
      return;
    }

    try {
      setUploadingPhoto(true);
      const res = await UserAPI.updatephoto(selectedId, photoFile);
      console.log(res);
      toast.success("Photo uploaded successfully");
      setPhotoFile(null);
      setPhotoPreview(res.data);
    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error("Photo upload failed");
    }finally {
      setUploadingPhoto(false);
    }
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
      try { localStorage.removeItem(doctorDraftKey); } catch {}
      fetchDoctors();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // ✅ Edit doctor
  const handleEdit = (doc) => {
    console.log("Editing doctor:", doc);  
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
      profilePhoto: doc.profilePictureUrl||""
    });
    setPhotoPreview(doc.profilePictureUrl || "");

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
      profilePhoto: ""
    });

    setIsEdit(false);
    setSelectedId(null);
    try { localStorage.removeItem(doctorDraftKey); } catch {}
    setPhotoFile(null);
    setPhotoPreview("");
  };
  useEffect(() => {
    fetchDoctors();
  }, [doctorName, specialization, status]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Doctor Management</h1>

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow"
      >
        <div className="md:col-span-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-300 flex items-center justify-center text-xl font-bold text-white">
              {photoPreview ? (
                <img src={form.profilePhoto} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                "D"
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700">Profile photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-2 w-full"
              />
            </div>

            <button
              type="button"
              onClick={uploadPhoto}
              className={`rounded-lg bg-slate-900 px-4 py-2 text-white ${uploadingPhoto ? "cursor-not-allowed" : "hover:bg-slate-700"}`}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>

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

        <DatePicker
          label="Date of Birth"
          value={form.dateOfBirth}
          onChange={(dateOfBirth) => setForm({ ...form, dateOfBirth })}
        />

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

        <div>
            <input type="text" placeholder="Search by name..." value={doctorName} onChange={(e)=>setDoctorName(e.target.value)} className="border px-3 py-2 m-4"/>
            <select value={specialization} onChange={(e)=>setSpecialization(e.target.value)} className="border px-3 py-2 m-4">
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="border px-3 py-2 m-4">
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
        </div>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Doctors List</h2>
        </div>  

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