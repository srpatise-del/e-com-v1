import axios from "axios";

const api = axios.create({
  // ใช้พอร์ตเดียวกับ backend local โดยมี env override ได้
  baseURL: import.meta.env.VITE_API_URL || "https://e-com-v1-bvn8.onrender.com//api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
