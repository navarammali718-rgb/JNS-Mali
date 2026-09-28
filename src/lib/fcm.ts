import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

let firebaseApp: App | null = null;

if (!getApps().length) {
  const projectId = process.env['FIREBASE_PROJECT_ID'];
  const clientEmail = process.env['FIREBASE_CLIENT_EMAIL'];
  let privateKey = process.env['FIREBASE_PRIVATE_KEY'] || '';

  console.log('[FCM Init] projectId present:', !!projectId);
  console.log('[FCM Init] clientEmail present:', !!clientEmail);
  console.log('[FCM Init] privateKey length:', privateKey.length);

  if (!projectId || !clientEmail || !privateKey) {
    console.error('[FCM Init] ❌ Missing Firebase credentials! Push notifications will NOT work.');
  } else {
    try {
      // Handle all common private key formats from different hosting providers:
      // 1. Remove wrapping quotes if the value was stored with them
      privateKey = privateKey.replace(/^"|"$/g, '');
      // 2. Replace literal \n sequences with actual newlines (most common Netlify issue)
      privateKey = privateKey.replace(/\\n/g, '\n');

      console.log('[FCM Init] Private key starts with:', privateKey.substring(0, 30));
      console.log('[FCM Init] Private key contains BEGIN marker:', privateKey.includes('BEGIN PRIVATE KEY'));

      firebaseApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('[FCM Init] ✅ Firebase Admin SDK initialized successfully!');
    } catch (error) {
      console.error('[FCM Init] ❌ Firebase admin initialization FAILED:', error);
    }
  }
} else {
  firebaseApp = getApps()[0];
}

let messaging: Messaging;
try {
  messaging = getMessaging();
  console.log('[FCM Init] ✅ Messaging service ready');
} catch (e) {
  console.error('[FCM Init] ❌ getMessaging() failed:', e);
  // Create a dummy so the server doesn't crash, but logs clear errors when push is attempted
  messaging = {
    sendEachForMulticast: async () => {
      console.error('[FCM] ❌ Cannot send push — Firebase was never initialized');
      throw new Error('Firebase Messaging not initialized — check FIREBASE_* env vars');
    },
  } as any;
}

export { messaging };
