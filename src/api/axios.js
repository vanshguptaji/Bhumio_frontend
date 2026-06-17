import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.api.timeout,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug: log outgoing requests when enabled
    try {
      if (import.meta.env.VITE_DEBUG === 'true') {
        // Log JSON bodies (trimmed) but avoid logging FormData or streams
        let dataPreview = undefined;
        try {
          if (config.data && !(config.data instanceof FormData) && typeof config.data === 'object') {
            const json = JSON.stringify(config.data);
            dataPreview = json.length > 1000 ? json.slice(0, 1000) + '... (trimmed)' : json;
          } else if (config.data && typeof config.data !== 'object') {
            dataPreview = config.data;
          }
        } catch (e) {
          dataPreview = undefined;
        }

        console.log('API Request:', { method: config.method, url: config.url, headers: config.headers, data: dataPreview });
      }
    } catch (e) {
      // ignore logging errors
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    const message =
      data?.message ||
      error?.message ||
      "Something went wrong";

    // Pretty-print common validation formats
    try {
      if (Array.isArray(data?.message)) {
        console.error('API Error:', { status, message: data.message.slice(0, 10), data });
      } else if (data && typeof data === 'object') {
        console.error('API Error:', { status, message, data });
      } else {
        console.error('API Error:', { status, message, data });
      }
    } catch (e) {
      console.error('API Error:', { status, message, data });
    }

    return Promise.reject(error);
  }
);

export default api;