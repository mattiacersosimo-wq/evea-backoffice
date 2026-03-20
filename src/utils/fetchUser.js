import axios from "axios";
import { buildApiUrl } from "src/config";

const fetchUser = axios.create({
    baseURL: buildApiUrl("api/user"),
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

fetchUser.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response?.status === 401) {
            return (window.location = "/auth/login");
        }
        return Promise.reject(
            (error?.response && error.response.data) ||
                error?.message ||
                "Something went wrong"
        );
    }
);

fetchUser.interceptors.request.use(function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

export default fetchUser;
