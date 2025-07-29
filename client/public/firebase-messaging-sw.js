importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDBvLcgdCrdJSTa79BsYwtdyvYQEl-itAU',
    authDomain: 'ezquit-a88f3.firebaseapp.com',
    projectId: 'ezquit-a88f3',
    storageBucket: 'ezquit-a88f3.firebasestorage.app',
    messagingSenderId: '221786247064',
    appId: '1:221786247064:web:5ae225f6c7656f7e2da5ed',
    measurementId: 'G-X6Z671NJJL'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

    const notificationTitle = payload.data?.title || 'New Notification';
    const notificationOptions = {
        body: payload.data?.body || '',
        icon: payload.data?.image || '/favicon.ico',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
