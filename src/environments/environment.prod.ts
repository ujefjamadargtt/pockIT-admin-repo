export const environment = {
  production: true,

  firebase: {
    // vapid:
    //   'BMnTXkD1p2ExPL_iPgdTHrrdLLHdCNYg2ZCUJRb1h-2tTuTfkeZVzNVXJN1b36rBSHpjIqel-mc_PLOsA9Lckf8',
    // apiKey: 'AIzaSyA5p3rU3z-A0QwV5_fEryVvQh4CFvlJckg',
    // authDomain: 'pockit-df54e.firebaseapp.com',
    // projectId: 'pockit-df54e',
    // storageBucket: 'pockit-df54e.firebasestorage.app',
    // messagingSenderId: '658839127239',
    // appId: '1:658839127239:web:9d5101fb9718275b116ae2',
    // measurementId: 'G-N76JL181BX',
    vapid:
      'BIU1YUTbVEYFSrcIMYvL4nYC_KsjSq1ALjDfej4ga7nCP5jp74gnC4jqHcxYSENtmXbWxw1kUp5N9Wzsd-3fajc',
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
  appVersioning: {
    appVersion: require('../../package.json').version,
  },
};