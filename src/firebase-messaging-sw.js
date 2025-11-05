importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

// old

// firebase.initializeApp({
//   apiKey: "AIzaSyA5p3rU3z-A0QwV5_fEryVvQh4CFvlJckg",
//   authDomain: "pockit-df54e.firebaseapp.com",
//   projectId: "pockit-df54e",
//   storageBucket: "pockit-df54e.firebasestorage.app",
//   messagingSenderId: "658839127239",
//   appId: "1:658839127239:web:9d5101fb9718275b116ae2",
//   measurementId: "G-N76JL181BX"
// });


// new 

firebase.initializeApp({
  apiKey: "AIzaSyBHNvnQFnEV4oLDQREF1nXNbllOV-5STKY",
  authDomain: "pockit-engineers.firebaseapp.com",
  projectId: "pockit-engineers",
  storageBucket: "pockit-engineers.firebasestorage.app",
  messagingSenderId: "427204155934",
  appId: "1:427204155934:web:e9576c9de50b2aa2f5ac0f",
  measurementId: "G-ZKJWKWPMB9"
});

const messaging = firebase.messaging();
if ("serviceWorker" in navigator) {


  navigator.serviceWorker.register("firebase-messaging-sw.js").then(function (registration) { }).catch(function (err) { console.log("error", err); });
}

messaging.onBackgroundMessage((payload) => {
  self.clients.matchAll({
    type: "window", includeUncontrolled: true
  }).then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(payload);
    });
  });
});

self.addEventListener("push", (event) => {
  const promiseChain = isClientFocused(event).then((clientIsFocused) => {

    var data = event.data.json().notification;
    var title = data.title || "No tiltle";

    self.registration.showNotification(title, {
      body: data.body,
      icon: './assets/PockIT_Logo.png',
      tag: 'PockIT',
      sound: 'default' // Ask for default system sound
    });


    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({
          type: 'NEW_NOTIFICATION',
          payload: data,
        });
      });
    });

    return;
  });
  event.waitUntil(promiseChain);

});

// self.addEventListener("push", (event) => {
//   const promiseChain = isClientFocused(event).then((clientIsFocused) => {

//     var data = event.data.json().notification;
//     var title = data.title || "No tiltle";

//     self.registration.showNotification(title, {
//       body: data.body,
//       icon: './assets/PockIT_Logo.png',
//       tag: 'PockIT',
//     })
//     return;
//   });
//   event.waitUntil(promiseChain);
// });

function isClientFocused(event) {
  var data = event.data.json().data;
  return clients.matchAll({ type: "window", includeUncontrolled: true, }).then((windowClients) => {
    let clientIsFocused = false;
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused) {
        clientIsFocused = false;
        break;
      }
    }
    return false;

  });
}