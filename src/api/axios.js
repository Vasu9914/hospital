import axios from "axios";
import { toast } from "react-toastify";
const API = axios.create({
  baseURL: "http://localhost:8080",
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) =>{
     toast.success(response.data.message || "Success");
     return response.data;
  },
  (error) =>{
     toast.error(error.response.data.message || "Error");
     return Promise.reject(error)
  }
);
export default API;