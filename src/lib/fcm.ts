import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env['FIREBASE_PROJECT_ID'] as string,
        clientEmail: process.env['FIREBASE_CLIENT_EMAIL'] as string,
        privateKey: (process.env['FIREBASE_PRIVATE_KEY'] || '').replace(/\\n/g, '\n').replace(/"/g, ''),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const messaging = getMessaging();
