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
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
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
