// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // firebase: {
  //   apiKey: 'AIzaSyA5p3rU3z-A0QwV5_fEryVvQh4CFvlJckg',
  //   authDomain: 'pockit-df54e.firebaseapp.com',
  //   projectId: 'pockit-df54e',
  //   storageBucket: 'pockit-df54e.firebasestorage.app',
  //   messagingSenderId: '658839127239',
  //   appId: '1:658839127239:web:9d5101fb9718275b116ae2',
  //   measurementId: 'G-N76JL181BX',
  //   appVersion1: require('../../package.json').version + '-dev',
  //   appVersion2: require('../../package.json').version,
  // },

  firebase: {
    apiKey: "AIzaSyBHNvnQFnEV4oLDQREF1nXNbllOV-5STKY",
    authDomain: "pockit-engineers.firebaseapp.com",
    projectId: "pockit-engineers",
    storageBucket: "pockit-engineers.firebasestorage.app",
    messagingSenderId: "427204155934",
    appId: "1:427204155934:web:e9576c9de50b2aa2f5ac0f",
    measurementId: "G-ZKJWKWPMB9",
    appVersion1: require('../../package.json').version + '-dev',
    appVersion2: require('../../package.json').version,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
