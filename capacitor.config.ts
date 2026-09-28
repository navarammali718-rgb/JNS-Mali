import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jnsmali.app',
  appName: 'JNS Mali',
  webDir: 'dist',
  server: {
    url: 'https://jnsmali.netlify.app',
    cleartext: true,
    allowNavigation: ['jnsmali.netlify.app']
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
