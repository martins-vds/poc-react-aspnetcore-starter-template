import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { msalConfig } from "./authConfig.ts";
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";

import { BrowserRouter } from "react-router-dom";

const pca = new PublicClientApplication(msalConfig);

pca.initialize().then(() => {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = pca.getAllAccounts();
  if (accounts.length > 0) {
    pca.setActiveAccount(accounts[0]);
  }

  pca.addEventCallback((event: EventMessage) => {
    if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS) &&
      event.payload
    ) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      pca.setActiveAccount(account);
    }
  });

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App pca={pca} />
      </BrowserRouter>
    </React.StrictMode>
  );
});
