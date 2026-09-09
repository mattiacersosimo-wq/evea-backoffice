import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Preferences } from "@capacitor/preferences";
import { App as CapApp } from "@capacitor/app";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
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

  // OTA Live Updates via Capgo (self-hosted).
  // Notifica al plugin che il bundle web e' caricato correttamente:
  // se non chiamato entro 10s dal boot -> auto-rollback al bundle precedente.
  try {
    await CapacitorUpdater.notifyAppReady();
  } catch (e) {
    console.warn("CapacitorUpdater notifyAppReady failed", e);
  }

  // Check per bundle nuovo in background (non blocca UI).
  // Bug precedente: download() scaricava il bundle ma non era mai
  // attivato per l'apply successivo. Serve chiamare next({id}) per
  // marcare quale bundle applicare al prossimo cold-start.
  try {
    const manifestUrl = "https://api.myevea.com/updates/manifest.json";
    const res = await fetch(manifestUrl, { cache: "no-store" });
    if (res.ok) {
      const manifest = await res.json();
      if (manifest.url && manifest.version) {
        const current = await CapacitorUpdater.current();
        if (current?.bundle?.version !== manifest.version) {
          console.log(`[OTA] Nuovo bundle ${manifest.version} disponibile, download in corso...`);
          const bundle = await CapacitorUpdater.download({
            url: manifest.url,
            version: manifest.version,
            checksum: manifest.checksum || undefined,
          });
          // Marca il bundle come "next" — sara' attivato al prossimo cold-start.
          // Senza next() il download restava dormant e l'app continuava sul
          // bundle bundled originale (bug scoperto 09/09/2026).
          if (bundle?.id) {
            await CapacitorUpdater.next({ id: bundle.id });
            console.log(`[OTA] Bundle ${manifest.version} scaricato + marked next, sara' attivo al prossimo restart`);
          } else {
            console.warn("[OTA] Download completato ma bundle.id mancante — non posso chiamare next()");
          }
        }
      }
    }
  } catch (e) {
    console.warn("OTA check failed (silent)", e);
  }
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
        // Endpoint mappato in web.php dentro il gruppo user (auth+is_user):
        // /api/user/push-token — NON /api/wp/user/push-token (path errato
        // in versioni precedenti che causava 404 silenzioso e token perso).
        await axiosInstance.post("api/user/push-token", {
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
