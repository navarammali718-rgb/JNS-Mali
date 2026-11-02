import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jnsmali.admin',
  appName: 'JNS MALI Admin',
  webDir: 'dist',
  server: {
    url: 'https://jnsmali.in/admin',
    cleartext: true,
    allowNavigation: [
      'jnsmali.in',
      '*.jnsmali.in',
      'jnsmali.netlify.app',
      '*.netlify.app',
      '*.clerk.accounts.dev',
      '*.clerk.com',
      'nominatim.openstreetmap.org',
      'photon.komoot.io',
    ],
  },
  appendUserAgent: 'JNS_ADMIN',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
