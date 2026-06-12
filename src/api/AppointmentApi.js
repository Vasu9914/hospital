import API from './axios';

export const AppointmentAPI = {
  book: (data) => API.post("/appointments", data),
 getAll: (doctorId, patientId, startDate, endDate, appointmentStatus, page, size) => {
  const params = new URLSearchParams();

  if (doctorId) params.append("doctorId", doctorId);
  if (patientId) params.append("patientId", patientId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (appointmentStatus) params.append("appointmentStatus", appointmentStatus);

  params.append("page", page ?? 0);
  params.append("size", size ?? 10);

  console.log("Query Params:", params.toString());

  return API.get(`/appointments?${params.toString()}`);
},
  cancel: (id) => API.delete(`/appointments/${id}`),
};