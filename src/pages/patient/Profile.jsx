import React, { useEffect, useState } from 'react';
import { PatientAPI } from '../../api/PatientApi';
import { UserAPI } from '../../api/UserApi';
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
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await PatientAPI.getProfile();

      // ✅ merge safely
      setProfile(prev => ({
        ...prev,
        ...res.data
      }));

      setPhotoPreview(res.data?.photoUrl || res.data?.profilePhoto || res.data?.imageUrl || "");

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
      

      // rollback
      setProfile(previousProfile);

      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
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

    try {
      await UserAPI.updatephoto(photoFile);
      toast.success("Profile photo uploaded ✅");
      setPhotoFile(null);
      getProfile();
    } catch (error) {
      console.log(error);
      toast.error("Photo upload failed ❌");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex justify-center items-center p-6">

      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          My Profile
        </h1>

        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              profile.name?.charAt(0)?.toUpperCase() || "P"
            )}
          </div>

          <div className="w-full">
            <label className="text-sm text-gray-600">Profile photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full border rounded-lg p-2 mt-1 bg-white"
            />
            <button
              type="button"
              onClick={uploadPhoto}
              className="w-full mt-2 rounded-lg bg-slate-900 py-2 text-white hover:bg-slate-700"
            >
              Upload Photo
            </button>
          </div>
        </div>

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