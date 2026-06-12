import API from './axios';

export const PatientAPI = {
  getPatients: (name) => API.get(`/patient?name=${name}`),
  getProfile: () => API.get("/patient/profile"),
  updateProfile: (data) => API.put("/patient/profile", data),
};
