// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyAc4TwzVjz_8_ADgYUMpDu_6XbtiBKakIk",
    authDomain: "stonks-1960c.firebaseapp.com",
    projectId: "stonks-1960c",
    storageBucket: "stonks-1960c.appspot.com",
    messagingSenderId: "975845052424",
    appId: "1:975845052424:web:3dc66158a568edbdf581bd"
};


firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload)
});


self.addEventListener('notificationclick', function (event) {
    console.log(event)

    // do what you want
    //OK
    // ...
});
