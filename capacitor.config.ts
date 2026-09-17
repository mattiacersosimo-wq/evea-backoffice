import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evea.backoffice',
  appName: 'eVea Backoffice',
  webDir: 'build',
  ios: {
    // 'never': disabilita il contentInset automatico del WKWebView.
    // Con 'always' il WebView aggiungeva ~44px di padding top che sommato
    // al CSS env(safe-area-inset-top) dava doppio padding e menu spinto
    // giu' al cold start.
    contentInset: 'never',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      // launchAutoHide=false: il splash resta finche' initNativeShell() non chiama
      // SplashScreen.hide() manualmente. Questo permette al check OTA immediato
      // (native.js) di scaricare + applicare l'update PRIMA che React monti,
      // eliminando il flash "schermata vecchia" al boot.
      // Fallback: launchShowDuration=5000 nasconde comunque dopo 5s se qualcosa
      // blocca (connessione morta, crash init, ecc) — no risk di splash infinito.
      launchShowDuration: 5000,
      launchAutoHide: false,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
    },
    CapacitorUpdater: {
      // directUpdate=true: quando l'app trova un update via check manuale,
      // lo attiva SUBITO nella sessione corrente (invece di aspettare il prossimo
      // cold start). Combinato con SplashScreen manuale + timeout 5s in native.js
      // = utente vede la UI aggiornata al primo avvio, non "quella di ieri".
      autoUpdate: false,
      directUpdate: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FFFFFF',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
