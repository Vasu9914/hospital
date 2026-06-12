import API from './axios';

export const AdminAPI = {
  getDashboard: () => API.get("/admin/dashboard"),
  getDoctors: (name, specialization, status) =>{
    return API.get("/admin/doctors", {
      params: { name, specialization, status }
    });
  },
  createDoctor: (data) => API.post("/admin/doctors", data),
  updateDoctor: (id, data) => API.put(`/admin/${id}`, data),
  getStats: (doctorName, specialization,startDate,endDate) =>{
    return API.get("/admin/doctor-stats", {
      params: { doctorName, specialization,startDate,endDate }
    });
  } 
    ,
};