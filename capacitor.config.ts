import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jnsmali.admin',
  appName: 'JNS Admin',
  webDir: 'dist',
  server: {
    url: 'https://jns-mali.netlify.app/admin',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
