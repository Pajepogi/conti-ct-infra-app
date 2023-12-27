// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gatewayURL : "https://ct-it-infra-dev-app-gateway.conti.de/api/",
  bypassAD : true,
  azureAdClientId : "2777dde8-bcfc-47cf-9fde-b5df7f4d3680",
  authority : "https://login.microsoftonline.com/8d4b558f-7b2e-40ba-ad1f-e04d79e6265a",
  redirectUrl : "http://localhost:4200"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
