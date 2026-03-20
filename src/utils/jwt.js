import jwtDecode from "jwt-decode";
//
import axios from "./axios";

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false;
    }

    // ----------------------------------------------------------------------

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

// ----------------------------------------------------------------------

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        // This function below will handle when token is expired
        // const { exp } = jwtDecode(accessToken);
        // handleTokenExpired(exp);
    } else {
        localStorage.removeItem("accessToken");
        delete axios.defaults.headers.common.Authorization;
    }
};

const clearSession = () => {
    setSession(null);
    localStorage.removeItem("menu");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isSubAdmin");
    localStorage.removeItem("isImpersonate");
    localStorage.removeItem("u_name");
    localStorage.removeItem("source_id");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("plan");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("package_status");
    localStorage.removeItem("reg-config");
};

const getSession = () => Boolean(localStorage.getItem("accessToken"));

export { clearSession, getSession, isValidToken, setSession };
