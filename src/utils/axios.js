import axios from "axios";
import i18n from "src/locales/i18n";
import { HOST_API } from "../config";
import { clearSession } from "./jwt";

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      clearSession();
      return (window.location = "/auth/login");
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
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default axiosInstance;
