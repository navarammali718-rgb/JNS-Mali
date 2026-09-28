import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jnsmali.app',
  appName: 'JNS Mali',
  webDir: 'dist',
  server: {
    url: 'https://jns-mali.netlify.app',
    cleartext: true,
    allowNavigation: ['jns-mali.netlify.app']
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
