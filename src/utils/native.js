import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Preferences } from "@capacitor/preferences";
import { App as CapApp } from "@capacitor/app";
import axiosInstance from "./axios";

// NOTE: Firebase Messaging import rimosso temporaneamente per evitare crash
// all'avvio. FirebaseApp.configure() richiede GoogleService-Info.plist nel
// bundle Xcode target — Capacitor lo copia in filesystem ma non lo aggiunge
// al pbxproj. Serve fix via post_install hook Podfile o manuale su Xcode.
// Fino ad allora, push iOS restano non funzionanti (backend logga
// "invalid FCM registration token") ma app non crasha piu'.

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
    PushNotifications.addListener("pushNotificationActionPerformed", (evt) => {
      const url = evt.notification?.data?.deep_link || evt.notification?.data?.url;
      if (url) window.location.hash = url.startsWith("/") ? url : `/${url}`;
    });

    PushNotifications.addListener("registration", async (token) => {
      // NOTE: su iOS token.value = APNs token raw (hex 64 char) NON FCM
      // token. Il backend attualmente si aspetta FCM token quindi le push
      // iOS non arrivano finche' non integriamo @capacitor-firebase/messaging
      // con GoogleService-Info.plist nel bundle target correttamente.
      // Su Android token.value = FCM token nativo (funziona).
      try {
        await axiosInstance.post("api/wp/user/push-token", {
          token: token.value,
          platform: Capacitor.getPlatform(),
          app: "backoffice",
        });
      } catch (e) {
        console.warn("push-token upload failed", e);
      }
      resolve(token.value);
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
