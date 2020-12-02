// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  firebase: {
    apiKey: 'AIzaSyAX9lqISM-U8qmtwJ4L5nOCNHPxT52BNGc',
    authDomain: 'dashboardata.firebaseapp.com',
    databaseURL: 'https://dashboardata.firebaseio.com',
    projectId: 'dashboardata',
    storageBucket: 'dashboardata.appspot.com',
    messagingSenderId: '1054473502950',
    appId: '1:1054473502950:web:c91bfda0ad857505a1bb27',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
