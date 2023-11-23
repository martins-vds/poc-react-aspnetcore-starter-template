import { useState, useCallback } from "react";

import {
  AccountInfo,
  InteractionType,
  PopupRequest,
} from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { parseChallenges } from "../utils/claimsUtils";
import { addClaimsToStorage } from "../utils/storageUtils";
import { msalConfig } from "../authConfig";

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 * @param {PopupRequest} msalRequest
 * @returns
 */
const useFetchWithMsal = (msalRequest: PopupRequest) => {
  const { instance } = useMsal();
  const account = instance.getActiveAccount() ?? undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState(null);

  const {
    acquireToken,
    result,
    error: msalError,
  } = useMsalAuthentication(InteractionType.Popup, {
    ...msalRequest,
    account: account,
    redirectUri: "/redirect",
  });

  /**
   * Execute a fetch request with the given options
   * @param {string} method: GET, POST, PUT, DELETE
   * @param {String} endpoint: The endpoint to call
   * @param {Object} data: The data to send to the endpoint, if any
   * @returns JSON response
   */
  const execute = async (method: string, endpoint: string, data = null) => {
    if (msalError) {
      // in case popup is blocked, use redirect instead
      if (
        msalError.errorCode === "popup_window_error" ||
        msalError.errorCode === "empty_window_error"
      ) {
        acquireToken(InteractionType.Redirect, msalRequest);
      }
      return;
    }

    if (result) {
      try {
        let response = null;

        const headers = new Headers();
        const bearer = `Bearer ${result.accessToken}`;
        headers.append("Authorization", bearer);

        if (data) headers.append("Content-Type", "application/json");

        const options = {
          method: method,
          headers: headers,
          body: data ? JSON.stringify(data) : null,
        };

        setIsLoading(true);

        response = await handleClaimsChallenge(
          await fetch(endpoint, options),
          endpoint,
          account!
        );

        setData(response);
        setIsLoading(false);

        return response;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e instanceof Error) {
          if (e.message === "claims_challenge_occurred") {
            acquireToken(InteractionType.Redirect, msalRequest);
          } else {
            setError(e);
            setIsLoading(false);
          }
        } else {
          setError(new Error(e));
          setIsLoading(false);
        }
      }
    }
  };

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, [result, msalError]), // to avoid infinite calls when inside a `useEffect`
  };
};

/**
 * This method inspects the HTTPS response from a fetch call for the "www-authenticate header"
 * If present, it grabs the claims challenge from the header and store it in the localStorage
 * For more information, visit: https://docs.microsoft.com/en-us/azure/active-directory/develop/claims-challenge#claims-challenge-header-format
 * @param {object} response
 * @returns response
 */
export const handleClaimsChallenge = async (
  response: Response,
  apiEndpoint: string,
  account: AccountInfo
) => {
  if (response.status === 200) {
    return response.json();
  } else if (response.status === 401) {
    if (response.headers.get("WWW-Authenticate")) {
      const authenticateHeader = response.headers.get("WWW-Authenticate");
      const claimsChallenge = parseChallenges(authenticateHeader!);

      /**
       * This method stores the claim challenge to the session storage in the browser to be used when acquiring a token.
       * To ensure that we are fetching the correct claim from the storage, we are using the clientId
       * of the application and oid (user’s object id) as the key identifier of the claim with schema
       * cc.<clientId>.<oid>.<resource.hostname>
       */
      addClaimsToStorage(
        `cc.${msalConfig.auth.clientId}.${account.idTokenClaims!.oid}.${
          new URL(apiEndpoint).hostname
        }`,
        claimsChallenge.claims
      );

      throw new Error(`claims_challenge_occurred`);
    }

    throw new Error(`Unauthorized: ${response.status}`);
  } else {
    throw new Error(
      `Something went wrong with the request: ${response.status}`
    );
  }
};

export default useFetchWithMsal;
