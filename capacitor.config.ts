import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jnsmali.admin',
  appName: 'JNS Admin',
  webDir: 'dist',
  server: {
    url: 'https://jnsmali.in/admin',
    cleartext: true,
    allowNavigation: ['jnsmali.in', 'jnsmali.netlify.app']
  },
  appendUserAgent: "JNS_ADMIN",
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
