import API from './axios';

export const DoctorAPI = {
  getDoctors: (name, specialization, page = 0, size = 6) => {
  const params = new URLSearchParams();

  if (name) params.append("name", name);
  if (specialization) params.append("specialization", specialization);

  params.append("page", page);
  params.append("size", size);

  return API.get(`/doctor?${params.toString()}`);
},
  getProfile: () => API.get("/doctor/profile"),
  updateProfile: (data) => API.put("/doctor/profile", data),
};