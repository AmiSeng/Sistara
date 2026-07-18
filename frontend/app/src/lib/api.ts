import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

/**
 * Attach correct authentication token
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;

      const isStudentRoute = pathname.startsWith("/student");

      const token = isStudentRoute
        ? localStorage.getItem("studentToken")
        : localStorage.getItem("adminToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Handle expired/invalid tokens
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("studentToken");

      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
