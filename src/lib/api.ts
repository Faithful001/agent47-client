import axios from "axios";

const API_BASE = "http://localhost:8000";
// const API_BASE = "https://b11d-102-90-97-165.ngrok-free.app";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // sending the HttpOnly session_token cookie
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or revoked — redirect to login
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
