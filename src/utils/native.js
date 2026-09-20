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

  // Check OTA SINCRONO con timeout 4s: se c'e' un update disponibile e riusciamo
  // a scaricarlo + applicarlo in tempo, l'utente vede subito la versione nuova
  // (set() ricarica il WebView col bundle appena scaricato). Se timeout scade
  // o download fallisce, fallback su next() come prima (attivo al prossimo boot).
  // Motivo: prima gli utenti vedevano per ~1s la "schermata vecchia" al primo
  // boot dopo un deploy, poi al restart successivo apparivano gli update.
  //
  // Timeout aumentato 4s -> 15s (17/09/2026): bundle da 6.7MB su 4G/Wi-Fi
  // lento non riusciva a completarsi in 4s, cadeva su next() ma il cold
  // start successivo non arrivava mai (utenti aprono da background).
  // 15s dà margine per completare il download in condizioni realistiche.
  const OTA_TIMEOUT_MS = 15000;
  // OTA_TELEMETRY 2026-09-20: riporta ogni step al server per debug remoto.
  // Endpoint pubblico /api/wp/ota/report accetta {step, detail, current_version, target_version, platform}.
  // No-op se network down, no user impact.
  const otaReport = async (step, detail = null, extra = {}) => {
    try {
      await fetch("https://api.myevea.com/api/wp/ota/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step, detail,
          platform: Capacitor.getPlatform(),
          ...extra,
        }),
      });
    } catch (_) { /* silent */ }
  };

  const otaCheck = (async () => {
    let current, manifest;
    try {
      current = await CapacitorUpdater.current();
    } catch (e) {
      otaReport("current_error", String(e?.message || e));
      return "current-error";
    }
    otaReport("current", null, { current_version: current?.bundle?.version });

    try {
      const res = await fetch("https://api.myevea.com/updates/manifest.json", { cache: "no-store" });
      if (!res.ok) { otaReport("manifest_http_error", String(res.status)); return "no-manifest"; }
      manifest = await res.json();
    } catch (e) {
      otaReport("manifest_fetch_error", String(e?.message || e));
      return "manifest-fetch-error";
    }
    if (!manifest.url || !manifest.version) {
      otaReport("manifest_invalid", JSON.stringify(manifest).slice(0, 200));
      return "no-manifest";
    }
    if (current?.bundle?.version === manifest.version) {
      otaReport("up_to_date", null, { current_version: current?.bundle?.version, target_version: manifest.version });
      return "up-to-date";
    }
    otaReport("download_start", null, { current_version: current?.bundle?.version, target_version: manifest.version });

    let bundle;
    try {
      bundle = await CapacitorUpdater.download({
        url: manifest.url,
        version: manifest.version,
        checksum: manifest.checksum || undefined,
      });
    } catch (e) {
      otaReport("download_error", String(e?.message || e), { target_version: manifest.version });
      return "download-error";
    }
    if (!bundle?.id) { otaReport("download_no_id", null, { target_version: manifest.version }); return "no-bundle-id"; }
    otaReport("download_ok", null, { target_version: manifest.version, bundle_id: bundle.id });

    try { await CapacitorUpdater.next({ id: bundle.id }); }
    catch (e) { otaReport("next_error", String(e?.message || e)); }

    try {
      await CapacitorUpdater.set({ id: bundle.id });
    } catch (e) {
      otaReport("set_error", String(e?.message || e));
      return "set-error";
    }
    otaReport("set_ok", null, { target_version: manifest.version });
    return "reloaded";
  })();

  const timeout = new Promise((resolve) => setTimeout(() => resolve("timeout"), OTA_TIMEOUT_MS));

  try {
    const result = await Promise.race([otaCheck, timeout]);
    console.log(`[OTA] result=${result}`);
    otaReport("final_result", result);
    if (result === "reloaded") return;
  } catch (e) {
    otaReport("race_error", String(e?.message || e));
    console.warn("OTA immediate check failed (silent, proceeding)", e);
  }

  // Nasconde splash — l'app procede col bundle attuale.
  // Casi: (1) nessun update disponibile, (2) update scaricato ma set() lento
  // (timeout), (3) errore rete, (4) manifest non raggiungibile.
  // In tutti i casi, meglio mostrare l'app rispetto a bloccare l'utente.
  try {
    await SplashScreen.hide();
  } catch (e) {
    console.warn("SplashScreen.hide failed", e);
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
      if (!url) return;
      const path = url.startsWith("/") ? url : `/${url}`;
      // BrowserRouter (path-based) NON ascolta window.location.hash change
      // (bug pre-14/09/2026: tap push -> restava sulla pagina attuale).
      // history.pushState + dispatch popstate simula una back/forward
      // navigation che React Router intercetta correttamente.
      try {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch (e) {
        // Fallback: reload completo alla nuova path (sempre funziona)
        window.location.assign(path);
      }
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
