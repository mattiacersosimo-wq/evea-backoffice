import { GoogleOAuthProvider } from "@react-oauth/google";

import { useEffect } from "react";
import NotistackProvider from "./components/NotistackProvider";
import { ProgressBarStyle } from "./components/ProgressBar";
import RtlLayout from "./components/RtlLayout";
import ScrollToTop from "./components/ScrollToTop";
import ThemeColorPresets from "./components/ThemeColorPresets";
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import { ChartStyle } from "./components/chart";
import FloatingAction from "./components/floating-action";
import Settings from "./components/settings";
import Ternary from "./components/ternary";
import Visitor from "./components/visitor";
import { ENABLE_VISITOR_MODE, GOOGLE_CLIENT_ID } from "./config";
import useAuth from "./hooks/useAuth";
import useGetCurrency from "./layouts/shared/header/components/currency-popover/hooks/use-get-currency";
import Router from "./routes";
import { useAppConfig } from "./store/app-config";
import ThemeProvider from "./theme";
import axiosInstance from "./utils/axios";
import { getSession } from "./utils/jwt";
import { useLocation } from "react-router";

const fetchBrandSettings = async () => {
  try {
    const { data, status } = await axiosInstance("api/company-logos");
    if (status === 200) {
      const { logo, side_bar_logo, favicon } = data.data;
      if (logo) {
        localStorage.setItem("logo", logo);
        localStorage.setItem("side_bar_logo", logo);
        localStorage.setItem("favicon", favicon);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export default function App() {
  const fetchCurrency = useGetCurrency();
  const { config, setConfig } = useAppConfig();
  const { getUser, user, isAdmin, isSubAdmin } = useAuth();
  useEffect(() => {
    if (user && !Object.keys(user).length) {
      getUser();
      fetchCurrency(isAdmin || isSubAdmin);
      return;
    }
  }, [user]);
  useEffect(() => {
    const fetchAppConfig = async () => {
      try {
        const { data } = await axiosInstance("api/config-settings");
        const test = data.data.reduce((acc, curr) => {
          const { code, status, value } = curr || {};

          return {
            ...acc,
            [code]: { status: Boolean(status), value },
          };
        }, {});
        setConfig(test);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAppConfig();
  }, []);

  useEffect(() => {
    fetchBrandSettings();
  }, []);

  const isLoggedIn = getSession();
  const { pathname } = useLocation();
  const isLoginPath = pathname?.includes("admin") || pathname?.includes("user");
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ThemeColorPresets>
          <RtlLayout>
            <NotistackProvider>
              <MotionLazyContainer>
                <ProgressBarStyle />
                <ChartStyle />
                <Settings />
                <ScrollToTop />
                <Router />
                {/* <FloatingAction /> */}

                <Ternary
                  when={
                    ENABLE_VISITOR_MODE &&
                    isLoggedIn &&
                    Boolean(user) &&
                    isLoginPath
                  }
                  then={<Visitor />}
                />
              </MotionLazyContainer>
            </NotistackProvider>
          </RtlLayout>
        </ThemeColorPresets>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
