import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import useAuth from "src/hooks/useAuth";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_AUTH } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import { setSession } from "src/utils/jwt";

const OAuth = () => {
  const { getUser } = useAuth();
  const { g_token } = useParams();
  const navigate = useNavigate();
  const { queryObject } = useQueryParams();

  const handleSuccess = async (email, plan) => {
    const reqData = new FormData();
    reqData.append("email", email);
    reqData.append("plan", plan);
    try {
      const { status, data } = await axiosInstance.post(
        "api/google-login",
        reqData
      );

      if (status === 200) {
        const { access_token, user, menu_lists, package_status } =
          data?.data || {};
        if (Boolean(access_token)) {
          localStorage.setItem("menu", JSON.stringify(menu_lists));
          setSession(access_token);
          localStorage.setItem("isAdmin", Boolean(user.is_super_admin));
          localStorage.setItem("isSubAdmin", Boolean(user.is_sub_admin));
          localStorage.setItem("package_status", Boolean(package_status));
          getUser();

          window.location = "/";
        } else {
          navigate(PATH_AUTH.login, { state: data.message, replace: true });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLoggedInUserInfo = async (g_token) => {
    try {
      const { status, data } = await axios(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${g_token}`,
        {
          headers: {
            Authorization: `Bearer ${g_token}`,
            Accept: "application/json",
          },
        }
      );
      if (status === 200) {
        handleSuccess(data.email, queryObject?.plan);
      }
    } catch (err) {
      console.error(console.error("Retrieving Failed:", err));
    }
  };

  useEffect(() => {
    if (g_token) {
      getLoggedInUserInfo(g_token);
    }
  }, [g_token]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={3}>
        <CircularProgress size={130} disableShrink />
        <Typography>Loading Please Wait...</Typography>
      </Stack>
    </Box>
  );
};

export default OAuth;
