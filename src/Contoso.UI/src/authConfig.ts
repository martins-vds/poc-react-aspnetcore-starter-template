/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  Configuration,
  PopupRequest,
  PublicClientApplication,
} from "@azure/msal-browser";

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */

const b2cConfig = {
  domain: import.meta.env.VITE_B2C_DOMAIN,
  instance: import.meta.env.VITE_B2C_INSTANCE,
  clientId: import.meta.env.VITE_B2C_CLIENT_ID,
  signInPolicy: import.meta.env.VITE_B2C_SIGN_IN_POLICY,
};

export const b2cPolicies = {
  names: {
    signUpSignIn: b2cConfig.signInPolicy,
  },
  authorities: {
    signUpSignIn: {
      authority: `https://${b2cConfig.instance}/${b2cConfig.domain}/${b2cConfig.signInPolicy}`,
    },
  },
  authorityDomain: b2cConfig.instance,
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: b2cConfig.clientId, // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`, // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/logout`, // Indicates the page to navigate after logout.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    allowNativeBroker: false,
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  apiWeatherForecast: {
    endpoint:
      import.meta.env.VITE_API_WEATHER_FORECAST_ENDPOINT ??
      "https://localhost:7014/WeatherForecast",
    scopes: {
      access_as_user: [
        import.meta.env.VITE_API_WEATHER_FORECAST_SCOPE ??
          "https://MngEnvMCAP618718b2c.onmicrosoft.com/6d042a20-644b-492e-afbc-272d086c739c/access_as_user",
      ],
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest: PopupRequest = {
  scopes: [...protectedResources.apiWeatherForecast.scopes.access_as_user],
};

export const pca = new PublicClientApplication(msalConfig);
