import axios from "axios";
import i18n from "src/locales/i18n";
import { HOST_API } from "../config";
import { clearSession, setSession } from "./jwt";

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh or login requests
      if (originalRequest.url?.includes("refresh") || originalRequest.url?.includes("login")) {
        clearSession();
        window.location = "/auth/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          HOST_API + "/api/refresh",
          {},
          { headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") } }
        );

        if (data.status && data.access_token) {
          setSession(data.access_token);
          processQueue(null, data.access_token);
          originalRequest.headers.Authorization = "Bearer " + data.access_token;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearSession();
        window.location = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(
      (error?.response && error.response.data) ||
        error?.message ||
        "Something went wrong"
    );
  }
);

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers["Accept-Language"] = i18n.language;
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default axiosInstance;
