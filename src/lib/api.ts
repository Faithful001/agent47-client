import axios from "axios";
import { useAuthStore } from "../store/auth";

// Point this to your FastAPI backend
export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests and add the Bearer token automatically
api.interceptors.request.use(
  (config) => {
    // Grab the token directly from Zustand state
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error handling (e.g., if token expires, force logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/"; // Kick them back to login
    }
    return Promise.reject(error);
  }
);
