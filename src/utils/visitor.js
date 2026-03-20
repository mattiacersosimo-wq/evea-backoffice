import axios from "axios";
import i18n from "src/locales/i18n";
import { REACT_APP_ENABLE_VISITOR_HOST } from "../config";

const visitorServer = axios.create({
  baseURL: REACT_APP_ENABLE_VISITOR_HOST,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// visitorServer.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       localStorage.removeItem("menu");
//       localStorage.removeItem("isAdmin");
//       localStorage.removeItem("isSubAdmin");
//       localStorage.removeItem("isImpersonate");
//       localStorage.removeItem("u_name");
//       localStorage.removeItem("source_id");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("plan");
//       return (window.location = "/auth/login");
//     }
//     return Promise.reject(
//       (error.response && error.response.data) || "Something went wrong"
//     );
//   }
// );

visitorServer.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers["Accept-Language"] = i18n.language;
  if (token) {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default visitorServer;
