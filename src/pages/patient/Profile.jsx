import React, { useEffect, useState } from 'react';
import { PatientAPI } from '../../api/PatientApi';
import { toast } from 'react-toastify';

const Profile = () => {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "MALE",
    dateOfBirth: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
    emergencyContactNumber: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ GET PROFILE
  const getProfile = async () => {
    try {
      const res = await PatientAPI.getProfile();

      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        phoneNumber: res.data.phoneNumber || "",
        gender: res.data.gender || "MALE",
        dateOfBirth: res.data.dateOfBirth || "",
        address: res.data.address || "",
        bloodGroup: res.data.bloodGroup || "",
        allergies: res.data.allergies || "",
        medicalHistory: res.data.medicalHistory || "",
        emergencyContactNumber: res.data.emergencyContactNumber || ""
      });

    } catch (err) {
      toast.error("Failed to load profile ❌");
    }
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async () => {

    const payload = {
      name: profile.name,
      phoneNumber: profile.phoneNumber,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      address: profile.address,
      bloodGroup: profile.bloodGroup,
      allergies: profile.allergies,
      medicalHistory: profile.medicalHistory,
      emergencyContactNumber: profile.emergencyContactNumber
    };

    try {
      setLoading(true);
      await PatientAPI.updateProfile(payload);
      toast.success("Profile updated ✅");
    } catch (err) {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">

      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-bold mb-4 text-center">My Profile</h2>

        {/* Name */}
        <input
          placeholder="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />

        {/* Email (disabled) */}
        <input
          value={profile.email}
          disabled
          className="w-full border p-2 mb-2 rounded bg-gray-100"
        />

        {/* Phone */}
        <input
          placeholder="Phone"
          value={profile.phoneNumber}
          onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />

        {/* Gender */}
        <select
          value={profile.gender}
          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        {/* DOB */}
        <input
          type="date"
          value={profile.dateOfBirth}
          onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />

        {/* Address */}
        <input
          placeholder="Address"
          value={profile.address}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />

        {/* Blood Group */}
        <select
          value={profile.bloodGroup}
          onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="">Select Blood Group</option>
          <option value="O_POSITIVE">O+</option>
          <option value="A_POSITIVE">A+</option>
          <option value="B_POSITIVE">B+</option>
          <option value="AB_POSITIVE">AB+</option>
        </select>

        {/* Allergies */}
        <input
          placeholder="Allergies"
          value={profile.allergies}
          onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />

        {/* Medical History */}
        <input
          placeholder="Medical History"
          value={profile.medicalHistory}
          onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
        />

        {/* Emergency Contact */}
        <input
          placeholder="Emergency Contact"
          value={profile.emergencyContactNumber}
          onChange={(e) => setProfile({ ...profile, emergencyContactNumber: e.target.value })}
          className="w-full border p-2 mb-4 rounded"
        />

        {/* Update Button */}
        <button
          onClick={updateProfile}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </div>
    </div>
  );
};

export default Profile;