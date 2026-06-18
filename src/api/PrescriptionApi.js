import API from './axios';

export const PrescriptionAPI = {
  create: (data) => API.post("/prescriptions", data),
  getAll: (doctorId, patientId) => API.get("/prescriptions", { params: { doctorId, patientId } }),
  update: (id, data) => API.put(`/prescriptions/${id}`, data),
  getappointmentprescription: (appointmentId) => API.get(`/prescriptions/appointment/${appointmentId}`),
};