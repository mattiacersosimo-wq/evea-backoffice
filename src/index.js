// i18n
import "./locales/i18n";

// highlight
import "./utils/highlight";

// scroll bar
import "simplebar/src/simplebar.css";

// lightbox
import "react-image-lightbox/style.css";

// map
import "mapbox-gl/dist/mapbox-gl.css";

// editor
import "react-quill/dist/quill.snow.css";

// slick-carousel
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// lazy image
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Navigate } from "react-router-dom";
// @mui
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// redux
// contexts
import { CollapseDrawerProvider } from "./contexts/CollapseDrawerContext";
import { SettingsProvider } from "./contexts/SettingsContext";

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import { AuthProvider } from "./contexts/JWTContext";
// import { AuthProvider } from './contexts/Auth0Context';
// import { AuthProvider } from './contexts/FirebaseContext';
// import { AuthProvider } from './contexts/AwsCognitoContext';

//
import { Suspense } from "react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import AppConfig from "./store/app-config";
import CurrencyProvider from "./store/currency";
import { PlanProvider } from "./store/plan";

// ----------------------------------------------------------------------

ReactDOM.render(
  <Suspense fallback={<></>}>
    <PlanProvider>
      <AuthProvider>
        <HelmetProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SettingsProvider>
              <CollapseDrawerProvider>
                <BrowserRouter>
                  <CurrencyProvider>
                    <Suspense fallback={<Navigate to="/" />}>
                      <AppConfig>
                        <App />
                      </AppConfig>
                    </Suspense>
                  </CurrencyProvider>
                </BrowserRouter>
              </CollapseDrawerProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </HelmetProvider>
      </AuthProvider>
    </PlanProvider>
  </Suspense>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
