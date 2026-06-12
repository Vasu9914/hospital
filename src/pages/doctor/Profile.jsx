import React, { useEffect, useState } from "react";
import { DoctorAPI } from "../../api/DoctorApi.js";
import { toast } from "react-toastify";

export const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await DoctorAPI.getProfile();

      // ⚠️ adjust based on your backend response
      const data = res.data?.data || res.data;

      setDoctor(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching profile", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await DoctorAPI.updateProfile(formData);

      const data = res.data?.data || res.data;

      setDoctor(data);
      setIsEditing(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!doctor) {
    return <div className="p-6 text-red-500">No profile found</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Profile</h1>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={updateProfile}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(doctor);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-6">
        
        <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
          {doctor.name?.charAt(0)}
        </div>

        <div>
          <h2 className="text-xl font-semibold">{doctor.name}</h2>
          <p className="text-gray-500">{doctor.specialization}</p>
          <p className="text-sm text-gray-400">{doctor.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Experience</p>

          {isEditing ? (
            <input
              type="number"
              name="experience"
              value={formData.experience || ""}
              onChange={handleChange}
              className="mt-2 w-full border p-2 rounded"
            />
          ) : (
            <h2 className="text-xl font-bold">{doctor.experience} years</h2>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Consultation Fee</p>

          {isEditing ? (
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee || ""}
              onChange={handleChange}
              className="mt-2 w-full border p-2 rounded"
            />
          ) : (
            <h2 className="text-xl font-bold">₹{doctor.consultationFee}</h2>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Status</p>
          <h2 className="text-xl font-bold text-green-600">
            {doctor.status}
          </h2>
        </div>
      </div>

      {/* About */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">About</h3>

        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ) : (
          <p className="text-gray-600">{doctor.bio}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">

          <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
          <p><strong>Gender:</strong> {doctor.gender}</p>

          <p>
            <strong>Date of Birth:</strong>{" "}
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth?.split("T")[0] || ""}
                onChange={handleChange}
                className="border p-1 rounded"
              />
            ) : (
              doctor.dateOfBirth?.split("T")[0]
            )}
          </p>

          <p>
            <strong>Email Verified:</strong>{" "}
            {doctor.emailVerified ? "Yes" : "No"}
          </p>

        </div>
      </div>
    </div>
  );
};