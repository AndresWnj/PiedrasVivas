//importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
//importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");


importScripts('https://www.gstatic.com/firebasejs/8.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyDMMfK233HBhDFs_kjGqSGx_Bag2q0yUow",
    authDomain: "casadelrey-e6cf6.firebaseapp.com",
    databaseURL: "https://casadelrey-e6cf6.firebaseio.com",
    projectId: "casadelrey-e6cf6",
    storageBucket: "casadelrey-e6cf6.appspot.com",
    messagingSenderId: "966101535658",
    appId: "1:966101535658:web:395eecdcbcaa8f8396f9d3",
    measurementId: "G-L0153YQVH8"
  });
const messaging = firebase.messaging();
/* 
messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);

    var notificationTitle = payload.data.Titulo;

    var listener = new BroadcastChannel('listener');
    listener.postMessage(payload.data);
    
    if (!payload.data.RefreshCentroDespacho || payload.data.RefreshCentroDespacho === "false") {

        //listener.postMessage("1");

        console.log("SI CREO PUSH BACKGROUND");

        var notificationOptions = {
            body: payload.data.Descripcion,
            icon: '/Recursos/images/flash.png',
            data: { url: payload.data.Url2, id: payload.data.ItemId },
            actions: [{ action: "open_url", title: "Abrir Centro Control" }]
        };

        var a = self.registration.showNotification(notificationTitle, notificationOptions);
        return a;
    } else {
        console.log("NO CREO PUSH BACKGROUND");
        //listener.postMessage("0");
    }

    //return a;
});

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', function (event) {

    switch (event.action) {
        case 'open_url':
            var url = event.notification.data.url;
            console.log("open_url", url);
            //clients.openWindow(url); //which we got from above

            event.notification.close(); // Android needs explicit close.
            event.waitUntil(

                clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
                    console.log("cuales clientes hay");
                    console.log(windowClients);
                    // Check if there is already a window/tab open with the target URL
                    for (var i = 0; i < windowClients.length; i++) {
                        var client = windowClients[i];
                        // If so, just focus it.
                        if (client.url === url && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // If not, then open the target URL in a new window/tab.
                    if (clients.openWindow) {
                        return clients.openWindow(url);
                    }
                })
            );

            break;
    }
}
    , false);
 */