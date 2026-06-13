import API from './axios';
import { toast } from 'react-toastify';
export const AdminAPI = {
  getDashboard: () => API.get("/admin/dashboard"),
  getDoctors: (name, specialization, status) =>{
    return API.get("/admin/doctors", {
      params: { name, specialization, status }
    });
  },
  createDoctor: (data) => {
    const res = API.post("/admin/doctors", data);
    if(res.success) toast.success("Doctor created successfully");
    return res;
  },
  updateStatus:(id, data) =>{
       const res = API.put(`/admin/${id}`, data);
        if(res.success) toast.success("Doctor updated successfully");
       return res;
  },
  getStats: (doctorName, specialization,startDate,endDate) =>{
    return API.get("/admin/doctor-stats", {
      params: { doctorName, specialization,startDate,endDate }
    });
  },
  updateDoctor: (id, data) => {
    console.log("Updating doctor with ID:", id, "Data:", data);
    const res = API.put(`/admin/doctors/${id}`, data);
    if(res.success) toast.success("Doctor updated successfully");
    return res;
  }
};