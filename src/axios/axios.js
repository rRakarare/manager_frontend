import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api/";
const herokuURL = "https://testmanager-123.herokuapp.com/api/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
        "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use (
  async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject (error);
  }
);

export default axiosInstance;
