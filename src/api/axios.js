import axios from "axios";
import { toast } from "react-toastify";
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
});

// attach token automatically
API.interceptors.request.use((req) => {

if(!req.url.includes("/auth/") && !req.url.includes("/public/") ){

  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
}
  return req;
});

API.interceptors.response.use(
  (response) =>{
     return response.data;
  },
  (error) =>{
    console.log("API Error:", error.response);
     toast.error(error.response.data.message || "An error occurred");
     return Promise.reject(error)
  }
);
export default API;