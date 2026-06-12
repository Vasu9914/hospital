import React, { useEffect, useState } from 'react';
import { PatientAPI } from '../../api/PatientApi';
import { toast } from 'react-toastify';

const Profile = () => {

  // ✅ initialize (VERY IMPORTANT)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "MALE",
    dateOfBirth: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await PatientAPI.getProfile();

      // ✅ merge safely
      setProfile(prev => ({
        ...prev,
        ...res.data
      }));

    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile ❌");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {

    const payload = {
      name: profile.name,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      address: profile.address || ""
    };

    const previousProfile = { ...profile };

    try {
      setLoading(true);

      await PatientAPI.updateProfile(payload);

      toast.success("Profile updated ✅");

    } catch (error) {
      console.log("ERROR:", error.response?.data);

      // rollback
      setProfile(previousProfile);

      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex justify-center items-center p-6">

      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          My Profile
        </h1>

        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              value={profile.email}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              value={profile.phoneNumber}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <input
              type="date"
              value={profile.dateOfBirth || ""}
              onChange={(e) =>
                setProfile({ ...profile, dateOfBirth: e.target.value })
              }
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

        </div>

        <button
          onClick={updateProfile}
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-lg text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </div>

    </div>
  );
};

export default Profile;