import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Preferences } from "@capacitor/preferences";
import { App as CapApp } from "@capacitor/app";
import axiosInstance from "./axios";

export const isNative = () => Capacitor.isNativePlatform();

export const initNativeShell = async () => {
  if (!isNative()) return;

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#FFFFFF" });
  } catch (e) {
    console.warn("StatusBar init failed", e);
  }

  setTimeout(() => {
    SplashScreen.hide().catch(() => {});
  }, 800);

  CapApp.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) window.history.back();
    else CapApp.exitApp();
  });
};

export const registerPushNotifications = async () => {
  if (!isNative()) return null;

  const perm = await PushNotifications.checkPermissions();
  if (perm.receive !== "granted") {
    const req = await PushNotifications.requestPermissions();
    if (req.receive !== "granted") return null;
  }

  return new Promise((resolve) => {
    // Deep-link handler quando l'utente tocca una notifica
    PushNotifications.addListener("pushNotificationActionPerformed", (evt) => {
      const url = evt.notification?.data?.deep_link || evt.notification?.data?.url;
      if (url) window.location.hash = url.startsWith("/") ? url : `/${url}`;
    });

    // Su iOS PushNotifications.register() abilita APNs a livello sistema.
    // Su Android usa gia' FCM sotto il cofano.
    // In entrambi i casi FirebaseMessaging.getToken() ci da' il FCM token
    // (che e' quello che il backend PushBackofficeService si aspetta).
    PushNotifications.addListener("registration", async () => {
      try {
        const { token: fcmToken } = await FirebaseMessaging.getToken();
        if (!fcmToken) {
          console.warn("FCM token empty after registration");
          resolve(null);
          return;
        }
        await axiosInstance.post("api/wp/user/push-token", {
          token: fcmToken,
          platform: Capacitor.getPlatform(),
          app: "backoffice",
        });
        resolve(fcmToken);
      } catch (e) {
        console.warn("push-token upload failed", e);
        resolve(null);
      }
    });

    PushNotifications.addListener("registrationError", (err) => {
      console.warn("push registration error", err);
      resolve(null);
    });

    PushNotifications.register();
  });
};

export const nativeStorage = {
  async get(key) {
    if (!isNative()) return localStorage.getItem(key);
    const { value } = await Preferences.get({ key });
    return value;
  },
  async set(key, value) {
    if (!isNative()) return localStorage.setItem(key, value);
    await Preferences.set({ key, value: String(value) });
  },
  async remove(key) {
    if (!isNative()) return localStorage.removeItem(key);
    await Preferences.remove({ key });
  },
};
