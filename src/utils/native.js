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
  const OTA_TIMEOUT_MS = 4000;
  const otaCheck = (async () => {
    const res = await fetch("https://api.myevea.com/updates/manifest.json", { cache: "no-store" });
    if (!res.ok) return "no-manifest";
    const manifest = await res.json();
    if (!manifest.url || !manifest.version) return "no-manifest";
    const current = await CapacitorUpdater.current();
    if (current?.bundle?.version === manifest.version) return "up-to-date";
    console.log(`[OTA] Nuovo bundle ${manifest.version} disponibile, download in corso...`);
    const bundle = await CapacitorUpdater.download({
      url: manifest.url,
      version: manifest.version,
      checksum: manifest.checksum || undefined,
    });
    if (!bundle?.id) return "no-bundle-id";
    // Marca come next: se set() sotto va in timeout, l'update si applica
    // comunque al prossimo restart (fallback identico al comportamento precedente).
    await CapacitorUpdater.next({ id: bundle.id });
    // set() ricarica il WebView col nuovo bundle SUBITO. Il codice dopo non viene
    // eseguito (l'app riparte). Se set() fallisce o e' bloccato, il race col
    // timeout esterno prosegue col bundle attuale — l'update sara' comunque
    // attivo al prossimo cold-start grazie al next() sopra.
    await CapacitorUpdater.set({ id: bundle.id });
    return "reloaded";
  })();

  const timeout = new Promise((resolve) => setTimeout(() => resolve("timeout"), OTA_TIMEOUT_MS));

  try {
    const result = await Promise.race([otaCheck, timeout]);
    console.log(`[OTA] result=${result}`);
    if (result === "reloaded") {
      // App si sta ricaricando col nuovo bundle. Non nascondere splash qui:
      // il nuovo bundle chiamera' initNativeShell() di nuovo e gestira' hide.
      return;
    }
  } catch (e) {
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
