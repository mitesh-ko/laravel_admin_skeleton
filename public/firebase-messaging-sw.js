// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
// Note: You must update these values manually in this file as import.meta.env is not available here
const firebaseConfig = {
    apiKey: "AIzaSyDSXeRwEUOzNzYLhuG7-ekl-r4vPz3yuAo",
    authDomain: "superadmin-bf0ce.firebaseapp.com",
    projectId: "superadmin-bf0ce",
    storageBucket: "superadmin-bf0ce.firebasestorage.app",
    messagingSenderId: "375971238176",
    appId: "1:375971238176:web:9397b234e5c4982e204745",
    measurementId: "G-NRW75KCXR6"
};

try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        
        // If the payload contains a notification object, Firebase's SDK handles it automatically.
        // We only need to manually show it if it's a data-only payload.
        if (payload.notification) {
            return;
        }

        const notificationTitle = payload.data?.title || 'New Notification';
        const notificationOptions = {
            body: payload.data?.message || payload.data?.body || '',
            icon: '/favicon.ico'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
} catch (error) {
    console.log('Firebase messaging service worker setup failed:', error);
}
