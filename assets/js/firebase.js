var firebaseConfig = {
    apiKey: "AIzaSyDMMfK233HBhDFs_kjGqSGx_Bag2q0yUow",
    authDomain: "casadelrey-e6cf6.firebaseapp.com",
    databaseURL: "https://casadelrey-e6cf6.firebaseio.com",
    projectId: "casadelrey-e6cf6",
    storageBucket: "casadelrey-e6cf6.appspot.com",
    messagingSenderId: "966101535658",
    appId: "1:966101535658:web:395eecdcbcaa8f8396f9d3",
    measurementId: "G-L0153YQVH8"
  };
  
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

var ActualToken="";

if('serviceWorker' in navigator) { 

    //navigator.serviceWorker.register("firebase-messaging-sw.js",{scope:"firebase-cloud-messaging-push-scope"})

    navigator.serviceWorker.register('./app/../firebase-messaging-sw.js', {scope:"firebase-cloud-messaging-push-scope"})
    .then(function(registration) {
    //console.log("Service Worker Registered");
    messaging.useServiceWorker(registration);//comente  
    console.log('Registration successful, scope is:', registration.scope);
        if(ActualToken===""){
            messaging.getToken()
            .then(function (newtoken) {
                saveTokenF(newtoken);
            })
            .catch(function (reason) {
                console.log(reason);
            });
        }
    }); 
}



function IntitalizeFireBaseMessaging() {
    messaging
        .requestPermission()
        .then(function () {
            console.log("Notification Permission");
            return messaging.getToken();
        })
        .then(function (token) {
            saveTokenF(token);
        })
        .catch(function (reason) {
            console.log(reason);
        });
}

messaging.onMessage(function (payload) {
    
    console.log("llego una notificacion");
    console.log(payload);

    var listener = new BroadcastChannel('listener');
    listener.postMessage(payload);

    /*var notificationOptions = {
        body: payload.data.Descripcion,
        icon: '/assets/images/ic_app.png',
        data: { url: payload.data.Url2, id: payload.data.ItemId },
        actions: [{ action: "open_url", title: "Nueva actualización" }]
    };
    
    if (Notification.permission === "granted" && !payload.data.RefreshCentroDespacho) {
        var notification = new Notification(payload.data.Titulo, notificationOptions);

        notification.onclick = function (ev) {
            ev.preventDefault();
            //window.open(payload.notification.click_action, '_blank');

            var listener = new BroadcastChannel('listener');
            listener.postMessage(payload);

            notification.close();
        };
    }*/
});
messaging.onTokenRefresh(function () {
    messaging.getToken()
        .then(function (newtoken) {
            saveTokenF(newtoken);
        })
        .catch(function (reason) {
            console.log(reason);
        });
});

function saveTokenF(token) {
    console.log("saveTokenF : " + token);

    ActualToken=token;

    setTimeout(function() {
        jQuery('.qrcodeCanvas').qrcode({
            text	: ActualToken
        });	
       }, 3000);

    /*var url_ = "/CentroControl/SaveTokenFirebase?Token=" + token;
    $.ajax({
        type: 'GET',
        content: "application/json; charset=utf-8",//json objet
        dataType: "json",//formatearlo en json
        statusCode: getStatusCode(),
        url: url_
    }).done(function (data) {
        console.log("saveTokenF: "+data);
    }).fail(function () {
        console.log("saveTokenF: error");
    });*/
}
IntitalizeFireBaseMessaging();

//addddddddddddddddddddddddddddddddddddddddd

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', function (event) {

    switch (event.action) {
        case 'open_url':
            var url = event.notification.data.url;
            console.log("open_url", url);
            //clients.openWindow(url); //which we got from above

            event.notification.close(); // Android needs explicit close.
            /*event.waitUntil(

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
            );*/

            break;
        /*case 'any_other_action':
            clients.openWindow("https://www.example.com");
            break;*/
    }
}
    , false);

//addddddddddddddddddddddddddddddddddddddddd