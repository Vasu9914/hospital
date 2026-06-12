import API from './axios';

export const AuthAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  sendOtp: (data) => API.post("/auth/send-verification", data),
  verifyOtp: (data) => API.post("/auth/verify", data),
  forgotPassword: (data) => API.post("/auth/forget-password", data),
  resetPassword: (data) => API.post("/auth/reset-password", data),
  createDoctor: (data) => API.post("/auth/create-doctor", data),
};